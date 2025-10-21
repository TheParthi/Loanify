import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { applicants } from '@/lib/data';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const docRef = doc(db, 'applicants', params.id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    }
    
    const applicant = applicants.find(a => a.id === params.id);
    if (!applicant) {
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
    }
    
    return NextResponse.json(applicant);
  } catch (error) {
    const applicant = applicants.find(a => a.id === params.id);
    if (!applicant) {
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
    }
    return NextResponse.json(applicant);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const docRef = doc(db, 'applicants', params.id);
    await updateDoc(docRef, body);
    
    return NextResponse.json({ id: params.id, ...body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update applicant' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const docRef = doc(db, 'applicants', params.id);
    await deleteDoc(docRef);
    
    return NextResponse.json({ message: 'Applicant deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete applicant' }, { status: 500 });
  }
}