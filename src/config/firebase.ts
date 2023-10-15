import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDbBIdtTvFmJfb5Ei-Aent4cbaiYZwnfbw',
    authDomain: 'neuroidentigraf.firebaseapp.com',
    projectId: 'neuroidentigraf',
    storageBucket: 'neuroidentigraf.appspot.com',
    messagingSenderId: '391638733429',
    appId: '1:391638733429:web:80747959a97a3d4123de3c',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.languageCode = 'uk';
