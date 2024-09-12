import type { Document, ObjectId } from "mongoose";

export interface ContactData {
    userId: string | ObjectId;
    query: string;
    message: string;
}

export type ContactDocument = ContactData & Document;
