import { useFetcher, Form, useLoaderData } from 'react-router-dom'
import { getContact, updateContact } from '../utils'

export async function loader ({ params }) {
  const contact = await getContact(params.contactId)
  if (!contact) {
    throw new window.Response('', {
      status: 404,
      statusText: 'Not Found contactId'
    })
  }
  return contact
}

export async function action ({ request, params }) {
  const formData = await request.formData()
  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true'
  })
}

export default function Contact () {
  const contact = useLoaderData()

  return (
    <div id='contact'>
      <div>
        <img
          key={contact.image}
          src={contact.image || null}
        />
      </div>

      <div>
        <h1>
          {contact.firstName || contact.lastName
            ? (
              <>
                {contact.firstName} {contact.lastName}
              </>
              )
            : (<i>No Name</i>)}
          <Favorite contact={contact} />
        </h1>

        {contact.username && (
          <p style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Username:</span>
            <a
              target='_blank'
              href={`https://twitter.com/${contact.twitter}`} rel='noreferrer'
            >
              {contact.username}
            </a>
          </p>
        )}

        {contact.email && <p>{contact.email}</p>}

        <div>
          <Form action='edit'>
            <button type='submit'>Edit</button>
          </Form>
          <Form
            method='post'
            action='destroy'
            onSubmit={(event) => {
              if (
                !window.confirm(
                  'Please confirm you want to delete this record.'
                )
              ) {
                event.preventDefault()
              }
            }}
          >
            <button type='submit'>Delete</button>
          </Form>
        </div>
      </div>
    </div>
  )
}

function Favorite ({ contact }) {
  // yes, this is a `let` for later
  const fetcher = useFetcher()
  let favorite = contact.favorite

  if (fetcher.formData) {
    favorite = fetcher.formData.get('favorite') === 'true'
  }

  return (
    <fetcher.Form method='post'>
      <button
        name='favorite'
        value={favorite ? 'false' : 'true'}
        aria-label={
          favorite
            ? 'Remove from favorites'
            : 'Add to favorites'
        }
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}
