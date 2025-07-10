import User from './User.js';
import Contact from './Contact.js';

// Встановлення асоціацій між моделями
// Один користувач може мати багато контактів
User.hasMany(Contact, { 
  foreignKey: 'owner',
  as: 'contacts' 
});

// Кожен контакт належить одному користувачу
Contact.belongsTo(User, { 
  foreignKey: 'owner',
  as: 'user' 
});

export { User, Contact }; 