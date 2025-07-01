// Firestore 데이터 동기화 훅 (agora-jake 프로젝트 전용)
import { useState, useEffect, useCallback } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase';

// Firestore 데이터 동기화 훅
export const useFirestoreData = (docId, defaultData, collectionName = COLLECTIONS.SECTIONS) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // 문서 참조
  const docRef = doc(db, collectionName, docId);

  // 실시간 데이터 구독
  useEffect(() => {
    console.log(`🔥 Firestore 구독 시작: ${collectionName}/${docId}`);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        try {
          if (docSnapshot.exists()) {
            const firestoreData = docSnapshot.data();
            console.log(`✅ Firestore에서 데이터 수신:`, firestoreData);
            setData(firestoreData.content || defaultData);
          } else {
            console.log(`📝 문서가 존재하지 않음, 기본값 사용`);
            setData(defaultData);
          }
          setLoading(false);
          setError(null);
          setIsOnline(true);
        } catch (err) {
          console.error('❌ Firestore 데이터 읽기 실패:', err);
          setError(err);
          setLoading(false);
          setIsOnline(false);
          // 오프라인 모드에서는 localStorage 사용
          const localData = localStorage.getItem(`agora-${docId}`);
          if (localData) {
            try {
              setData(JSON.parse(localData));
              console.log('📱 오프라인 모드: localStorage 데이터 사용');
            } catch (parseErr) {
              console.error('❌ localStorage 파싱 실패:', parseErr);
              setData(defaultData);
            }
          }
        }
      },
      (err) => {
        console.error('❌ Firestore 구독 실패:', err);
        setError(err);
        setLoading(false);
        setIsOnline(false);
        // 오프라인 모드에서는 localStorage 사용
        const localData = localStorage.getItem(`agora-${docId}`);
        if (localData) {
          try {
            setData(JSON.parse(localData));
            console.log('📱 오프라인 모드: localStorage 데이터 사용');
          } catch (parseErr) {
            console.error('❌ localStorage 파싱 실패:', parseErr);
            setData(defaultData);
          }
        }
      }
    );

    return () => {
      console.log(`🔥 Firestore 구독 해제: ${collectionName}/${docId}`);
      unsubscribe();
    };
  }, [docId, collectionName]);

  // 데이터 업데이트 함수
  const updateData = useCallback(async (newData) => {
    try {
      console.log(`🔄 Firestore 업데이트 시작:`, newData);
      
      // 로컬 상태 즉시 업데이트 (낙관적 업데이트)
      setData(newData);
      
      // localStorage에 백업 저장
      localStorage.setItem(`agora-${docId}`, JSON.stringify(newData));
      
      // Firestore에 저장
      await setDoc(docRef, {
        content: newData,
        lastUpdated: serverTimestamp(),
        updatedBy: 'admin'
      }, { merge: true });
      
      console.log('✅ Firestore 업데이트 완료');
      setError(null);
      setIsOnline(true);
      
    } catch (err) {
      console.error('❌ Firestore 업데이트 실패:', err);
      setError(err);
      setIsOnline(false);
      
      // 실패 시에도 localStorage는 유지
      localStorage.setItem(`agora-${docId}`, JSON.stringify(newData));
      console.log('📱 오프라인 모드: localStorage에 저장됨');
    }
  }, [docRef, docId]);

  // 특정 필드 업데이트
  const updateField = useCallback(async (sectionId, field, value) => {
    const updatedData = {
      ...data,
      [sectionId]: {
        ...data[sectionId],
        [field]: value
      }
    };
    
    await updateData(updatedData);
  }, [data, updateData]);

  return {
    data,
    loading,
    error,
    isOnline,
    updateData,
    updateField
  };
};

// 뉴스 데이터 전용 훅
export const useNewsData = (defaultNews = []) => {
  return useFirestoreData('news', defaultNews, COLLECTIONS.NEWS);
}; 