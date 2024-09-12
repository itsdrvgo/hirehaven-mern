import mongoose from "mongoose";
import { Application } from "../../modules/applications/models/application.js";
import { Category } from "../../modules/categories/models/category.js";
import { Contact } from "../../modules/contacts/models/contact.js";
import { Job } from "../../modules/jobs/models/job.js";
import { User } from "../../modules/users/models/user.js";
import { logger } from "../helpers/index.js";
import { generateDbUrl } from "../utils.js";

class Database {
    private readonly uri: string;
    public applications: typeof Application;
    public categories: typeof Category;
    public contacts: typeof Contact;
    public jobs: typeof Job;
    public users: typeof User;

    constructor(uri: string) {
        this.uri = uri;
        this.applications = Application;
        this.categories = Category;
        this.contacts = Contact;
        this.jobs = Job;
        this.users = User;
    }

    connect = async () => {
        const connection = await mongoose.connect(this.uri);
        logger.info(`Connected to database : ${connection.connection.name}`);
    };

    disconnect = async () => {
        await mongoose.disconnect();
        logger.info("Disconnected from database");
    };
}

export const db = new Database(generateDbUrl());
