import { useEffect } from 'react'
import { redirect, useLoaderData, Outlet, NavLink, Form, useNavigation, useSubmit } from 'react-router-dom'
import { getContacts, createContact } from '../utils'

export async function loader ({ request }) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const contacts = await getContacts()
  return { contacts, q }
}

export async function action () {
  const contact = await createContact()
  return redirect(`/contacts/${contact.id}/edit`)
}

export default function Root () {
  const { contacts, q } = useLoaderData()
  const navigation = useNavigation()
  /* const submit = useSubmit() */

  /* const handleSubmit = (event) => {
    const isFirstSearch = q == null
    submit(event.currentTarget.form, {
      replace: !isFirstSearch
    })
  } */

  /* const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      'q'
    ) */

  /* useEffect(() => {
    document.getElementById('q').value = q
  }, [q]) */

  return (
    <>
      <div id='sidebar'>
        <h1>React Router Contacts</h1>
        <div>
          <Form id='search-form' role='search'>
            <input
              id='q'
              /* className={searching ? 'loading' : ''} */
              aria-label='Search contacts'
              placeholder='Search'
              type='search'
              name='q'
              defaultValue={q}
              /* onChange={handleSubmit} */
            />
            {/* <div id='search-spinner' aria-hidden hidden={!searching} /> */}
            <div className='sr-only' aria-live='polite' />
          </Form>
          <Form method='post'>
            <button type='submit'>New</button>
          </Form>
        </div>
        <nav>
          {contacts.length
            ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      to={`${contact.id}`} className={({ isActive, isPending }) =>
                        isActive
                          ? 'active'
                          : isPending
                            ? 'pending'
                            : ''}
                    >
                      {contact.firstName || contact.lastName
                        ? (
                          <>
                            {contact.firstName} {contact.lastName}
                          </>
                          )
                        : (
                          <i>No Name</i>
                          )}
                      {contact?.favorite && <span>★</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
              )
            : (
              <p>
                <i>No contacts</i>
              </p>
              )}
        </nav>
      </div>
      <div
        id='detail' className={
          navigation.state === 'loading' ? 'loading' : ''
        }
      >
        <Outlet />
      </div>
    </>
  )
}
