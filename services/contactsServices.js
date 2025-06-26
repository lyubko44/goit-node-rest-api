import { Contact } from '../models/index.js';

// Отримати всі контакти користувача
export const listContacts = async (userId) => {
  try {
    const contacts = await Contact.findAll({
      where: { owner: userId },
      order: [['id', 'ASC']]
    });
    return contacts;
  } catch (error) {
    throw new Error(`Error fetching contacts: ${error.message}`);
  }
};

// Отримати контакт за ID (тільки якщо належить користувачу)
export const getContactById = async (contactId, userId) => {
  try {
    const contact = await Contact.findOne({
      where: { 
        id: contactId,
        owner: userId 
      }
    });
    return contact;
  } catch (error) {
    throw new Error(`Error fetching contact: ${error.message}`);
  }
};

// Створити новий контакт для користувача
export const addContact = async (body, userId) => {
  try {
    const contactData = {
      ...body,
      owner: userId
    };
    const contact = await Contact.create(contactData);
    return contact;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Contact with this email already exists');
    }
    throw new Error(`Error creating contact: ${error.message}`);
  }
};

// Оновити контакт (тільки якщо належить користувачу)
export const updateContact = async (contactId, body, userId) => {
  try {
    const [updatedRowsCount] = await Contact.update(body, {
      where: { 
        id: contactId,
        owner: userId 
      }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    const updatedContact = await Contact.findOne({
      where: { 
        id: contactId,
        owner: userId 
      }
    });
    return updatedContact;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Contact with this email already exists');
    }
    throw new Error(`Error updating contact: ${error.message}`);
  }
};

// Видалити контакт (тільки якщо належить користувачу)
export const removeContact = async (contactId, userId) => {
  try {
    const contact = await Contact.findOne({
      where: { 
        id: contactId,
        owner: userId 
      }
    });
    
    if (!contact) {
      return null;
    }
    
    await contact.destroy();
    return contact;
  } catch (error) {
    throw new Error(`Error deleting contact: ${error.message}`);
  }
};

// Оновити статус контакту (тільки якщо належить користувачу)
export const updateStatusContact = async (contactId, body, userId) => {
  try {
    const [updatedRowsCount] = await Contact.update(body, {
      where: { 
        id: contactId,
        owner: userId 
      }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    const updatedContact = await Contact.findOne({
      where: { 
        id: contactId,
        owner: userId 
      }
    });
    return updatedContact;
  } catch (error) {
    throw new Error(`Error updating contact status: ${error.message}`);
  }
};


