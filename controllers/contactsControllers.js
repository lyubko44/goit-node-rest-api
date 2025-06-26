import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts(req.user.id);
    res.json(contacts);
  } catch (error) {
    next(HttpError(500, error.message));
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id, req.user.id);
    
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id, req.user.id);
    
    if (!deletedContact) {
      throw HttpError(404, "Not found");
    }
    
    res.json({
      message: "Contact deleted",
      contact: deletedContact
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.addContact(req.body, req.user.id);
    res.status(201).json(newContact);
  } catch (error) {
    if (error.message.includes('already exists')) {
      next(HttpError(409, error.message));
    } else {
      next(HttpError(500, error.message));
    }
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedContact = await contactsService.updateContact(id, req.body, req.user.id);
    
    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }
    
    res.json(updatedContact);
  } catch (error) {
    if (error.message.includes('already exists')) {
      next(HttpError(409, error.message));
    } else {
      next(error);
    }
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await contactsService.updateStatusContact(contactId, req.body, req.user.id);
    
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
