import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, doc, updateDoc, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface BreakSession {
  id: string;
  name: string;
  badgeId: string;
  initials: string;
  gate: string;
  zone: string;
  sessionType: string;
  timeOut: Timestamp;
  timeIn: Timestamp | null;
  limitMinutes: number;
  supervisor: string;
  extension: string;
  status: 'Active' | 'Completed' | 'Force Resolved';
  resolveReason?: string;
  resolveNote?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function useBreakSessions() {
  const [sessions, setSessions] = useState<BreakSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'break_sessions'),
      where('status', 'in', ['Active', 'Completed', 'Force Resolved'])
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BreakSession[];
      setSessions(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'break_sessions');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addSession = async (sessionData: Omit<BreakSession, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'timeIn'>) => {
    try {
      await addDoc(collection(db, 'break_sessions'), {
        ...sessionData,
        status: 'Active',
        timeIn: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'break_sessions');
    }
  };

  const forceResolveSession = async (id: string, reason: string, note: string) => {
    try {
      const sessionRef = doc(db, 'break_sessions', id);
      await updateDoc(sessionRef, {
        status: 'Force Resolved',
        timeIn: serverTimestamp(),
        resolveReason: reason,
        resolveNote: note,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `break_sessions/${id}`);
    }
  };

  const completeSession = async (id: string) => {
    try {
      const sessionRef = doc(db, 'break_sessions', id);
      await updateDoc(sessionRef, {
        status: 'Completed',
        timeIn: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `break_sessions/${id}`);
    }
  };

  return { sessions, loading, addSession, forceResolveSession, completeSession };
}
