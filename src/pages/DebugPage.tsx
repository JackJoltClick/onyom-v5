import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export function DebugPage() {
  const { user } = useAuth()
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (test: string, result: any, error?: any) => {
    setResults(prev => [...prev, {
      test,
      result,
      error,
      timestamp: new Date().toISOString()
    }])
  }

  const runTests = async () => {
    setLoading(true)
    setResults([])

    try {
      // Test 1: Check auth
      addResult('Auth Status', { 
        isAuthenticated: !!user,
        userId: user?.id,
        email: user?.email 
      })

      if (!user?.id) {
        addResult('Error', 'User not authenticated', null)
        setLoading(false)
        return
      }

      // Test 2: Test user_profiles access
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        addResult('User Profile Query', profile, profileError)
      } catch (err) {
        addResult('User Profile Query', null, err)
      }

      // Test 3: Test chats access
      try {
        const { data: chats, error: chatsError } = await supabase
          .from('chats')
          .select('*')
          .eq('user_id', user.id)
        
        addResult('Chats Query', chats, chatsError)
      } catch (err) {
        addResult('Chats Query', null, err)
      }

      // Test 4: Test creating a chat
      try {
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            user_id: user.id,
            title: 'Debug Test Chat'
          })
          .select()
          .single()
        
        addResult('Create Chat', newChat, createError)

        // Test 5: If chat created, test message insertion
        if (newChat && !createError) {
          try {
            const { data: newMessage, error: messageError } = await supabase
              .from('messages')
              .insert({
                chat_id: newChat.id,
                content: 'Debug test message',
                sender: 'user'
              })
              .select()
              .single()
            
            addResult('Create Message', newMessage, messageError)

            // Clean up - delete test chat
            await supabase.from('chats').delete().eq('id', newChat.id)
            addResult('Cleanup', 'Test chat deleted', null)
          } catch (err) {
            addResult('Create Message', null, err)
          }
        }
      } catch (err) {
        addResult('Create Chat', null, err)
      }

    } catch (error) {
      addResult('General Error', null, error)
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Database Debug Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <Button onClick={runTests} disabled={loading}>
          {loading ? 'Running Tests...' : 'Run Database Tests'}
        </Button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Environment Check:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing'}
          SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
        </pre>
      </div>

      <div>
        <h3>Test Results:</h3>
        {results.map((result, index) => (
          <div key={index} style={{ 
            marginBottom: '15px', 
            padding: '10px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            backgroundColor: result.error ? '#ffe6e6' : '#e6ffe6'
          }}>
            <h4>{result.test}</h4>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {result.timestamp}
            </div>
            {result.result && (
              <pre style={{ fontSize: '12px', marginTop: '5px' }}>
                {JSON.stringify(result.result, null, 2)}
              </pre>
            )}
            {result.error && (
              <pre style={{ fontSize: '12px', marginTop: '5px', color: 'red' }}>
                Error: {JSON.stringify(result.error, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 