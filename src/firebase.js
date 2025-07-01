// Firebase 설정 파일 (agora-jake 프로젝트 전용)
import { initializeApp } from 'firebase/app';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ⚠️ 중요: agora-jake 프로젝트 설정만 사용
// doers-48e75, doers-ai-platform 절대 건드리지 않음
const firebaseConfig = {
  apiKey: "AIzaSyD225vzAq3uqBBGnv3wOpITJN1-HRp22gg",
  authDomain: "agora-jake.firebaseapp.com",
  projectId: "agora-jake",
  storageBucket: "agora-jake.firebasestorage.app",
  messagingSenderId: "1063442203472",
  appId: "1:1063442203472:web:679f378438ca900fdba255",
  measurementId: "G-LSXEBHXMTE"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스 초기화
export const db = getFirestore(app);

// Storage 초기화 (이미지 업로드용)
export const storage = getStorage(app);

// 네트워크 연결 관리
export const enableFirestore = () => enableNetwork(db);
export const disableFirestore = () => disableNetwork(db);

// 컬렉션 이름 상수 (데이터 구조 관리)
export const COLLECTIONS = {
  SECTIONS: 'agora-sections',
  NEWS: 'agora-news',
  SETTINGS: 'agora-settings'
};

console.log('🔥 Firebase 초기화 완료 (agora-jake 프로젝트)'); 