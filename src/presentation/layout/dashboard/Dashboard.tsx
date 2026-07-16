import { useState } from 'react'
import { LayoutContent } from './LayoutContent'
import { LayoutHead } from './LayoutHead'
import { LayoutSidebar } from './LayoutSidebar'

export const Dashboard = () => {
  const [title, setTitle] = useState('')
  return (
    <>
      <main className='w-full p-0 m-0'>
        <LayoutHead />
        <div className='w-full m-0 border-none h-[92vh] flex'>
          <aside
            style={{ border: '1px solid #d1d5db' }}
            className='flex align-items-center justify-content-center text-white mb-2 shadow rounded-md'
          >
            <LayoutSidebar setTitle={setTitle} />
          </aside>
          <section
            style={{ border: '1px solid #d1d5db', overflow: 'auto' }}
            className='block align-items-center justify-content-center ml-2 mb-2 shadow p-2 w-[86.8%] scroll-m-0 rounded-md'
          >
            <div className='header-list'>
              <h5>{title}</h5>
            </div>
            <LayoutContent />
          </section>
        </div>
      </main>
    </>
  )
}
