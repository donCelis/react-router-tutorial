import axios from 'axios'
import localforage from 'localforage'
import sortBy from 'sort-by'

export async function getContacts () {
  let contacts = await localforage.getItem('contacts')

  if (!contacts) contacts = []

  if (contacts.length === 0) {
    const request = await axios.get('https://dummyjson.com/users?limit=5')
    const { users } = request.data
    contacts = users
    await set(users)
  }
  return contacts.sort(sortBy('last', 'createdAt'))
}

export async function createContact () {
  const id = Math.random().toString(36).substring(2, 9)
  const contact = { id, createdAt: Date.now() }
  const contacts = await getContacts()
  contacts.push(contact)
  await set(contacts)
  return contact
}

export async function getContact (id) {
  const contacts = await localforage.getItem('contacts')
  const queryId = Number(id)
  const contact = contacts.find((contact) => contact.id === queryId)
  return contact ?? null
}

export async function updateContact (id, updates) {
  const contacts = await localforage.getItem('contacts')
  const queryId = Number(id)
  const contact = contacts.find((contact) => contact.id === queryId)
  if (!contact) throw new Error('No contact found for', id)

  const { data } = await axios.put(
    `https://dummyjson.com/users/${id}?select=firstName,lastName,username,image`,
    updates
  )
  const convertId = Number(data.id)

  const objectDemo = { ...data, id: convertId }

  await Object.assign(contact, objectDemo)
  await set(contacts)
  return contact
}

export async function deleteContact (id) {
  const contacts = await localforage.getItem('contacts')
  const queryId = Number(id)
  const index = contacts.findIndex((contact) => contact.id === queryId)

  if (index === -1) return false

  contacts.splice(index, 1)
  await set(contacts)
  return true
}

function set (contacts) {
  return localforage.setItem('contacts', contacts)
}
