import './index.css'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
/* components */
import Index from './routes'
import Root, {
  loader as rootLoader,
  action as rootAction
} from './routes/Root'
import Contact, {
  loader as contactLoader,
  action as contactAction
} from './routes/Contact'
import EditContact, { action as editAction } from './routes/Edit'
import { action as destroyAction } from './routes/Destroy'
import ErrorPage from './components/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/contacts' />
  },
  {
    path: '/contacts',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Index />
          },
          {
            path: ':contactId',
            element: <Contact />,
            loader: contactLoader,
            action: contactAction
          },
          {
            path: ':contactId/edit',
            element: <EditContact />,
            loader: contactLoader,
            action: editAction
          },
          {
            path: ':contactId/destroy',
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>
          }
        ]
      }
    ]
  }
])

const root = createRoot(document.getElementById('root'))

root.render(<RouterProvider router={router} />)
