import { useNavigate, Form, useLoaderData, redirect } from 'react-router-dom'
import { updateContact } from '../utils'

export async function action ({ request, params }) {
  const formData = await request.formData()
  const updates = Object.fromEntries(formData)
  await updateContact(params.contactId, updates)
  return redirect(`/contacts/${params.contactId}`)
}

export default function EditContact () {
  const contact = useLoaderData()
  const navigate = useNavigate()

  return (
    <Form method='post' id='contact-form'>
      <p>
        <span>Name</span>
        <input
          placeholder='First'
          aria-label='First name'
          type='text'
          name='firstName'
          defaultValue={contact?.firstName}
        />
        <input
          placeholder='Last'
          aria-label='Last name'
          type='text'
          name='lastName'
          defaultValue={contact?.lastName}
        />
      </p>
      <label>
        <span>Username</span>
        <input
          type='text'
          name='username'
          placeholder='@jack'
          defaultValue={contact?.username}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder='https://example.com/avatar.jpg'
          aria-label='Avatar URL'
          type='text'
          name='image'
          defaultValue={contact?.image}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name='notes'
          defaultValue={contact?.notes}
          rows={6}
        />
      </label>
      <p>
        <button type='submit'>Save</button>
        <button
          type='button' onClick={() => {
            navigate(-1)
          }}
        >Cancel
        </button>
      </p>
    </Form>
  )
}
