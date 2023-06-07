import { v4 as uuidv4 } from 'uuid';

import { initializeApp } from 'firebase/app';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  UserCredential,
  User,
  NextOrObserver,
} from 'firebase/auth';

import {
  getFirestore,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  Timestamp,
  collection,
  onSnapshot,
  query,
  writeBatch,
  runTransaction,
  where,
  serverTimestamp,
  orderBy,
  updateDoc,
  DocumentSnapshot,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  list,
  listAll,
  deleteObject,
  StorageReference,
  ListResult,
} from 'firebase/storage';
import {
  AdditionalInformation,
  Movement,
  ObjectToAdd,
  ProvidersInfo,
  ProvidersInfoPassword,
  UserCreation,
  UserData,
} from './firebase.types';
import {
  FileFields,
  FormFields,
} from '../../components/loan/loan-form.component';
import { Loan } from '../../components/loan-item/loan-item.component';

const firebaseConfig = {
  apiKey: 'AIzaSyDjVb89yW2JjQPvMjxSb3PiPRc73ttErGY',
  authDomain: 'bankist-app-fd00d.firebaseapp.com',
  projectId: 'bankist-app-fd00d',
  storageBucket: 'bankist-app-fd00d.appspot.com',
  messagingSenderId: '193658985644',
  appId: '1:193658985644:web:25c3b422a5dc39467b1309',
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
auth.useDeviceLanguage();

export const signInWithGooglePopup = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  return { ...result, credential };
};

export const db = getFirestore();

export const storage = getStorage();

type UploadInfoResult = {
  folderName: string;
  images: string[];
  timestamp: Timestamp;
};

export const uploadInfoForLoan = async (
  userAuth: UserData,
  formFileFields: FileFields,
  formFields: FormFields
) => {
  if (!userAuth) return;
  const regExp = /(?:\.([^.]+))?$/;
  const names = Object.keys(formFileFields);
  const fileNames = Object.values(formFileFields).map((file, idx) => {
    if (!file) return '';

    const ext = regExp.exec(file.name);

    if (!ext) return '';

    return `${names[idx]}.${ext[1]}`;
  });

  const files = Object.values(formFileFields).filter((file): file is File =>
    Boolean(file)
  );

  const userRef = ref(storage, `users/${userAuth.id}`);

  const folderName = uuidv4();

  const timestamp = Timestamp.fromDate(new Date());

  const dateFolderRef = ref(userRef, folderName);

  const loadFiles = files.map(async (file, idx) => {
    const snapshot = await uploadBytesResumable(
      ref(dateFolderRef, fileNames[idx]),
      file
    );

    return snapshot;
  });

  const snapshots = await Promise.all(loadFiles);

  const downloadURLs = snapshots.map(
    async snapshot => await getDownloadURL(snapshot.ref)
  );

  const result: UploadInfoResult = {
    folderName,
    images: await Promise.all(downloadURLs),
    timestamp,
    ...formFields,
  };

  return await createUserLoanDocument(userAuth, result);
};

export const createUserLoanDocument = async (
  userAuth: UserData,
  data: UploadInfoResult
) => {
  if (!userAuth) return;

  const { folderName, images, timestamp, ...formFields } = data;

  const folderDocRef = doc(db, 'users', userAuth.id, 'loans', folderName);
  const folderSnapshot = await getDoc(folderDocRef);

  if (!folderSnapshot.exists()) {
    await setDoc(folderDocRef, {
      images,
      timestamp,
      isAllowed: null,
      ...formFields,
    });

    return await getDoc(folderDocRef);
  }

  return folderSnapshot;
};

export const addMovementsToUser = async (
  objectsToAdd: ObjectToAdd[],
  userAuth: UserData
) => {
  const usersCollectionRef = collection(db, 'users');
  const batch = writeBatch(db);

  objectsToAdd.forEach(object => {
    const docRef = doc(usersCollectionRef, userAuth.id, 'movements', uuidv4());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done');
};

export const getMovements = async (userAuth: UserData) => {
  const querySnapshot: QuerySnapshot<Movement> = await new Promise(
    (resolve, reject) => {
      const q = query(
        collection(db, 'users', userAuth.id, 'movements'),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        querySnapshot => {
          unsubscribe();
          resolve(querySnapshot as QuerySnapshot<Movement>);
        },
        reject
      );
    }
  );

  const movementItems = querySnapshot.docs.map(docSnapshot =>
    docSnapshot.data()
  );

  return movementItems;
};

export const getUserCreditCard = async (creditCard: string) => {
  const q = query(
    collection(db, 'users'),
    where('creditCard', '==', creditCard)
  );

  const querySnapshot = (await getDocs(q)) as QuerySnapshot<UserData>;

  return querySnapshot;
};

export const transferAmountToUser = async (
  userAuth: UserData,
  userToTransfer: QueryDocumentSnapshot<UserData>,
  amount: number
) => {
  const collectionUsersRef = collection(db, 'users');

  const userTransferToDocRef = doc(collectionUsersRef, userToTransfer.id);
  const currentUserDocRef = doc(collectionUsersRef, userAuth.id);

  const movementDepositRef = doc(userTransferToDocRef, 'movements', uuidv4());
  const movementWithdrawalRef = doc(currentUserDocRef, 'movements', uuidv4());

  await runTransaction(db, async transaction => {
    await transaction.get(userTransferToDocRef);

    transaction.set(movementDepositRef, {
      value: amount,
      date: serverTimestamp(),
    });

    transaction.set(movementWithdrawalRef, {
      value: -amount,
      date: serverTimestamp(),
    });
  });
};

export const getAllUserLoans = async () => {
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);

  const users = querySnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as UserData)
  );
  const loanSnapshots = users.map(
    async (user: UserData) => await getUserLoans(user)
  );
  const result = await Promise.all(loanSnapshots);

  return result.filter(loans => loans.length !== 0);
};

export const getUserLoans = async (userAuth: UserData) => {
  const userDocRef = doc(db, 'users', userAuth.id);
  const q = query(
    collection(userDocRef, 'loans'),
    orderBy('timestamp', 'desc')
  );

  const loanSnapshot = await getDocs(q);
  return loanSnapshot.docs.map(loanDoc => ({
    id: loanDoc.id,
    ...loanDoc.data(),
    userAuth,
  }));
};

// const generator = require('../credit-card-generator/credit-card-generator.utils');

export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation?: AdditionalInformation
): Promise<DocumentSnapshot<UserCreation> | void> => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        // creditCard: generator.GenCC('Mastercard', 1, Math.random)[0],
        creditCard: null,
        ...additionalInformation,
      });

      return (await getDoc(userDocRef)) as DocumentSnapshot<UserCreation>;
    } catch (error: any) {
      console.log('error creating the user', error.message);
    }
  }

  return userSnapshot as DocumentSnapshot<UserCreation>;
};

export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
  onAuthStateChanged(auth, callback);

export const signOutUser = async () => await signOut(auth);

export const getCurrentUser = (): Promise<User | null> =>
  new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      user => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });

export const isAdmin = async (userAuth: User) => {
  const adminDocRef = doc(db, 'admins', userAuth.uid);
  const adminSnapshot = await getDoc(adminDocRef);

  return { admin: adminSnapshot.exists() };
};

export const updatePermissionCreditLoan = async (
  userAuth: UserData,
  loan: Loan,
  flag: boolean
) => {
  const userDocRef = doc(db, 'users', userAuth.id);
  const movementDocRef = doc(userDocRef, 'movements', uuidv4());
  const loanDocRef = doc(userDocRef, 'loans', loan.id);

  const loanSnapshot = (await getDoc(loanDocRef)) as DocumentSnapshot<Loan>;

  if (!loanSnapshot.exists()) return;

  const { creditCard } = loanSnapshot.data();

  await updateDoc(userDocRef, {
    creditCard: creditCard
      .split('')
      .filter((char: string) => char !== ' ')
      .join(''),
  });

  await updateDoc(loanDocRef, {
    isAllowed: flag,
    timestamp: serverTimestamp(),
  });

  if (flag) {
    await setDoc(movementDocRef, {
      date: serverTimestamp(),
      value: Math.abs(loan.amount),
    });
  }
};

export const deleteUserAccount = async (user: User | null) => {
  try {
    if (!user || !auth.currentUser) return;

    const userDocRef = doc(db, 'users', user.uid);
    const loanCollectionRef = collection(userDocRef, 'loans');
    const movementsCollectionRef = collection(userDocRef, 'movements');

    const loanQuery = query(loanCollectionRef);
    const loanSnapshots = await getDocs(loanQuery);

    if (!loanSnapshots.empty) {
      const deletedLoanDocuments = loanSnapshots.docs.map(
        async loanSnapshot => {
          try {
            await deleteDoc(doc(loanCollectionRef, loanSnapshot.id));
            return { message: 'loan/Успешно удален' };
          } catch (error) {
            throw new Error('loan/Ошибка при удалении документа!');
          }
        }
      );

      await Promise.all(deletedLoanDocuments);
      await deleteListOfFilesFromLoan(user.uid);
    }

    const movementsQuery = query(movementsCollectionRef);
    const movementsSnapshots = await getDocs(movementsQuery);

    if (!movementsSnapshots.empty) {
      const deletedMovementsDocuments = movementsSnapshots.docs.map(
        async movementSnapshot => {
          try {
            await deleteDoc(doc(movementsCollectionRef, movementSnapshot.id));
            return { message: 'movement/Успешно удален' };
          } catch (error) {
            throw new Error('movement/Ошибка при удалении документа!');
          }
        }
      );

      await Promise.all(deletedMovementsDocuments);
    }

    await deleteDoc(userDocRef);
    await deleteUser(auth.currentUser);
  } catch (error) {
    throw error;
  }
};

type Files = {
  [name: string]: string[];
};

export const getListOfFilesFromLoan = async (id: string) => {
  // @RECURSIVE FUNCTION: INCOMPLETE
  const listRef = ref(storage, `users/${id}`);
  // const fetchFolders = await list(listRef, { maxResults: 10 });
  const fetchFolders = await list(listRef);

  const folderNames = fetchFolders.prefixes.map(
    (folderRef: StorageReference) => folderRef.name
  );

  const folderPromises = await Promise.all(
    fetchFolders.prefixes.map(
      async (folderRef: StorageReference) => await listAll(folderRef)
    )
  );

  const fetchedFiles: Promise<string[]>[] = folderPromises.map(
    (filesRef: ListResult) =>
      Promise.all(
        filesRef.items.map(async itemRef => await getDownloadURL(itemRef))
      )
  );

  const result: Promise<Files>[] = fetchedFiles.map(async (files, index) => ({
    [folderNames[index]]: await files,
  }));

  return result;
};

export const deleteListOfFilesFromLoan = async (id: string) => {
  const listRef = ref(storage, `users/${id}`);
  const fetchFolders = await list(listRef);

  const result = fetchFolders.prefixes.reduce(
    async (acc: any, folderRef: StorageReference) => {
      const filesRef = await listAll(folderRef);
      const fetchFiles = filesRef.items.map(async itemRef => {
        await deleteObject(itemRef);
        return itemRef.fullPath;
      });
      const files = await Promise.all(fetchFiles);
      return [...(await acc), { [folderRef.name]: files }];
    },
    []
  );

  return result;
};

export const reauthenticateUserWithCredential = async (
  providers: ProvidersInfo[] | ProvidersInfoPassword[]
): Promise<UserCredential | void> => {
  try {
    if (!auth.currentUser) return;

    const promptForCredentials = async () => {
      if (hasProviderPassword(providers)) {
        const provider = providers.find(
          profile => profile.providerId === 'password'
        ) as ProvidersInfoPassword;

        return EmailAuthProvider.credential(
          provider.email as string,
          provider.password
        );
      }

      if (providers.some(profile => profile.providerId === 'google.com')) {
        const { credential } = await signInWithGooglePopup();

        return credential;
      }
    };

    const credential = await promptForCredentials();

    if (!credential) return;

    const response = await reauthenticateWithCredential(
      auth.currentUser,
      credential
    );

    console.log(response);

    return response;
  } catch (error) {
    throw error;
  }
};

export const getProvidersInfo = (currentUser: User) => {
  return currentUser.providerData.map(
    (profile): ProvidersInfo => ({
      providerId: profile.providerId,
      email: profile.email,
    })
  );
};

export const hasProviderPassword = (
  providerInfo: ProvidersInfo[] | ProvidersInfoPassword[]
): providerInfo is ProvidersInfoPassword[] => {
  return providerInfo.some(({ providerId }) => providerId === 'password');
};
