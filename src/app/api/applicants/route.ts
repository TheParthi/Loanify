import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { applicants } from '@/lib/data';

export async function GET() {
  try {
    const applicantsRef = collection(db, 'applicants');
    const q = query(applicantsRef, orderBy('applicationDate', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json(applicants);
    }
    
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(applicants);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const applicantsRef = collection(db, 'applicants');
    const docRef = await addDoc(applicantsRef, {
      ...body,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
    });
    
    return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create applicant' }, { status: 500 });
  }
}