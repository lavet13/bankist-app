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
} from 'firebase/firestore';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  list,
  listAll,
  deleteObject,
} from 'firebase/storage';

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

export const uploadInfoForLoan = async (
  userAuth,
  formFileFields,
  formFields
) => {
  if (!userAuth) return;
  const regExp = /(?:\.([^.]+))?$/;
  const names = Object.keys(formFileFields);
  const fileNames = Object.values(formFileFields).map(
    ({ name }, idx) => `${names[idx]}.${regExp.exec(name)[1]}`
  );
  const files = Object.values(formFileFields);

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

  const result = {
    folderName,
    images: await Promise.all(downloadURLs),
    timestamp,
    ...formFields,
  };

  return await createUserLoanDocument(userAuth, result);
};

export const createUserLoanDocument = async (userAuth, data) => {
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

export const addMovementsToUser = async (objectsToAdd, userAuth) => {
  const usersCollectionRef = collection(db, 'users');
  const batch = writeBatch(db);

  objectsToAdd.forEach(object => {
    const docRef = doc(usersCollectionRef, userAuth.id, 'movements', uuidv4());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done');
};

export const getMovements = async userAuth => {
  const querySnapshot = await new Promise((resolve, reject) => {
    const q = query(
      collection(db, 'users', userAuth.id, 'movements'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        unsubscribe();
        resolve(querySnapshot);
      },
      reject
    );
  });

  const movementItems = querySnapshot.docs.map(docSnapshot =>
    docSnapshot.data()
  );

  return movementItems;
};

export const getUserCreditCard = async creditCard => {
  const q = query(
    collection(db, 'users'),
    where('creditCard', '==', creditCard)
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot;
};

export const transferAmountToUser = async (
  userAuth,
  userToTransfer,
  amount
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

  const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const loanSnapshots = users.map(async user => await getUserLoans(user));
  const result = await Promise.all(loanSnapshots);

  return result.filter(loans => loans.length !== 0);
};

export const getUserLoans = async userAuth => {
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
  userAuth,
  additionalInformation = {}
) => {
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

      return await getDoc(userDocRef);
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userSnapshot;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const onAuthStateChangedListener = callback =>
  onAuthStateChanged(auth, callback);

export const signOutUser = async () => await signOut(auth);

export const getCurrentUser = () =>
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

export const isAdmin = async userAuth => {
  const adminDocRef = doc(db, 'admins', userAuth.uid);
  const adminSnapshot = await getDoc(adminDocRef);

  return { admin: adminSnapshot.exists() };
};

export const updatePermissionCreditLoan = async (userAuth, loan, flag) => {
  const userDocRef = doc(db, 'users', userAuth.id);
  const loanDocRef = doc(userDocRef, 'loans', loan.id);

  const loanSnapshot = await getDoc(loanDocRef);
  const { creditCard } = loanSnapshot.data();

  await updateDoc(userDocRef, {
    creditCard: creditCard
      .split('')
      .filter(char => char !== ' ')
      .join(''),
  });

  await updateDoc(loanDocRef, {
    isAllowed: flag,
    timestamp: serverTimestamp(),
  });
};

export const deleteUserAccount = async user => {
  try {
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

export const getListOfFilesFromLoan = async id => {
  // @RECURSIVE FUNCTION: INCOMPLETE
  const listRef = ref(storage, `users/${id}`);
  // const fetchFolders = await list(listRef, { maxResults: 10 });
  const fetchFolders = await list(listRef);

  const result = fetchFolders.prefixes.reduce(async (acc, folderRef) => {
    const filesRef = await listAll(folderRef);
    const fetchFiles = filesRef.items.map(async itemRef => {
      return await getDownloadURL(itemRef);
    });
    const files = await Promise.all(fetchFiles);
    return [...(await acc), { [folderRef.name]: files }];
  }, []);

  return result;
};

export const deleteListOfFilesFromLoan = async id => {
  const listRef = ref(storage, `users/${id}`);
  const fetchFolders = await list(listRef);

  const result = fetchFolders.prefixes.reduce(async (acc, folderRef) => {
    const filesRef = await listAll(folderRef);
    const fetchFiles = filesRef.items.map(async itemRef => {
      await deleteObject(itemRef);
      return itemRef.fullPath;
    });
    const files = await Promise.all(fetchFiles);
    return [...(await acc), { [folderRef.name]: files }];
  }, []);

  return result;
};

export const reauthenticateUserWithCredential = async providers => {
  try {
    const promptForCredentials = async () => {
      if (providers.some(profile => profile.providerId === 'password')) {
        const { email, password } = providers.find(
          profile => profile.providerId === 'password'
        );

        return EmailAuthProvider.credential(email, password);
      }

      if (providers.some(profile => profile.providerId === 'google.com')) {
        const { credential } = await signInWithGooglePopup();

        return credential;
      }
    };

    const credential = await promptForCredentials();

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
