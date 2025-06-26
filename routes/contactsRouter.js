import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactStatus,
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";
import authenticate from "../helpers/authenticate.js";
import { 
  createContactSchema, 
  updateContactSchema, 
  updateStatusSchema 
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

// Всі маршрути контактів потребують аутентифікації
contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:contactId/favorite", validateBody(updateStatusSchema), updateContactStatus);

export default contactsRouter;
