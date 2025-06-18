import Contact from '../models/Contact.js';

// Отримати всі контакти
export const listContacts = async () => {
  try {
    const contacts = await Contact.findAll({
      order: [['id', 'ASC']]
    });
    return contacts;
  } catch (error) {
    throw new Error(`Error fetching contacts: ${error.message}`);
  }
};

// Отримати контакт за ID
export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findByPk(contactId);
    return contact;
  } catch (error) {
    throw new Error(`Error fetching contact: ${error.message}`);
  }
};

// Створити новий контакт
export const addContact = async (body) => {
  try {
    const contact = await Contact.create(body);
    return contact;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Contact with this email already exists');
    }
    throw new Error(`Error creating contact: ${error.message}`);
  }
};

// Оновити контакт
export const updateContact = async (contactId, body) => {
  try {
    const [updatedRowsCount] = await Contact.update(body, {
      where: { id: contactId }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    const updatedContact = await Contact.findByPk(contactId);
    return updatedContact;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Contact with this email already exists');
    }
    throw new Error(`Error updating contact: ${error.message}`);
  }
};

// Видалити контакт
export const removeContact = async (contactId) => {
  try {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      return null;
    }
    
    await contact.destroy();
    return contact;
  } catch (error) {
    throw new Error(`Error deleting contact: ${error.message}`);
  }
};

// Оновити статус контакту
export const updateStatusContact = async (contactId, body) => {
  try {
    const [updatedRowsCount] = await Contact.update(body, {
      where: { id: contactId }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    const updatedContact = await Contact.findByPk(contactId);
    return updatedContact;
  } catch (error) {
    throw new Error(`Error updating contact status: ${error.message}`);
  }
};


