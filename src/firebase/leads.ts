
'use client';

import {
  Firestore,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { addDocumentNonBlocking } from './non-blocking-updates';

interface LeadData {
  name: string;
  phone: string;
}

/**
 * Saves a new lead to the 'leads' collection in Firestore.
 * @param firestore The Firestore instance.
 * @param data An object containing the lead's name and phone number.
 */
export function saveLead(firestore: Firestore, data: LeadData) {
  const leadsCollection = collection(firestore, 'leads');
  
  const leadData = {
    ...data,
    createdAt: serverTimestamp(),
  };

  // Uses the non-blocking function to add the document
  addDocumentNonBlocking(leadsCollection, leadData);
}
