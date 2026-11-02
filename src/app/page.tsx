import { appRouter } from '@/server/routers/_app';
import TaskList from './TaskList'
import { Suspense } from 'react';

export default async function Home() {
  const caller = appRouter.createCaller({});
  const initialTasks = await caller.getTasks();

  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>
      <Suspense fallback={<p className="text-gray-500">Loading...</p>} >
        <TaskList initialTasks={initialTasks} />
      </Suspense>
    </main>
  )
}