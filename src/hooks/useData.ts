import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Thread, Tweet, MediaFile, ThreadWithTweets } from '../types/database'

export function useThreads() {
  const [threads, setThreads] = useState<(Thread & { featured_image?: MediaFile })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchThreads() {
      try {
        setLoading(true)
        setError(null)
        
        // console.log('🔍 Récupération des threads...')
        
        // Get threads with better error handling
        const { data: threadsData, error: threadsError } = await supabase
          .from('threads')
          .select('*')
          .order('date_created', { ascending: false })

        if (threadsError) {
          // console.error('❌ Erreur threads:', threadsError)
          throw threadsError
        }

        // console.log(`✅ ${threadsData?.length || 0} threads récupérés`)

        if (!threadsData || threadsData.length === 0) {
          // console.log('⚠️ Aucun thread trouvé')
          setThreads([])
          return
        }

        // For each thread, get the featured image and Twitter publication date (first tweet's date)
        const threadsWithImages = await Promise.all(
          threadsData.map(async (thread) => {
            try {
              // Get first tweet of the thread with its publication date
              const { data: firstTweet, error: tweetError } = await supabase
                .from('tweets')
                .select('tweet_id, date_posted')
                .eq('thread_id', thread.thread_id)
                .order('date_posted', { ascending: true })
                .limit(1)
                .maybeSingle()

              let threadWithDate = { ...thread }
              
              if (!tweetError && firstTweet) {
                // Use Twitter publication date instead of thread creation date
                threadWithDate.date_created = firstTweet.date_posted
                
                // Get image for first tweet
                const { data: mediaFile, error: mediaError } = await supabase
                  .from('media_files')
                  .select('*')
                  .eq('tweet_id', firstTweet.tweet_id)
                  .maybeSingle()

                if (!mediaError && mediaFile) {
                  threadWithDate.featured_image = mediaFile
                }
              }

              return threadWithDate
            } catch (err) {
              // console.error('Error fetching data for thread:', thread.thread_id, err)
              return thread
            }
          })
        )

        // Sort by date (descending - most recent first)
        threadsWithImages.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())

        // console.log('✅ Threads traités avec succès')
        setThreads(threadsWithImages)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des threads'
        // console.error('❌ Erreur générale:', errorMessage)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchThreads()
  }, [])

  return { threads, loading, error }
}

export function useThreadWithTweets(threadId: string | undefined) {
  const [threadData, setThreadData] = useState<ThreadWithTweets | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!threadId) {
      // console.log('⚠️ useThreadWithTweets: Pas de threadId fourni')
      setLoading(false)
      return
    }

    async function fetchThreadWithTweets() {
      try {
        setLoading(true)
        setError(null)
        
        // console.log(`🔍 useThreadWithTweets: Récupération du thread ${threadId}`)
        
        // Fetch thread data
        const { data: thread, error: threadError } = await supabase
          .from('threads')
          .select('*')
          .eq('thread_id', threadId)
          .maybeSingle()

        if (threadError) {
          // console.error('❌ useThreadWithTweets: Erreur thread:', threadError)
          throw threadError
        }

        if (!thread) {
          // console.error('❌ useThreadWithTweets: Thread introuvable')
          throw new Error('Thread introuvable')
        }

        // console.log(`✅ useThreadWithTweets: Thread récupéré - ${thread.title}`)

        // Fetch tweets for this thread
        const { data: tweets, error: tweetsError } = await supabase
          .from('tweets')
          .select('*')
          .eq('thread_id', threadId)
          .order('date_posted', { ascending: true })

        if (tweetsError) {
          // console.error('❌ useThreadWithTweets: Erreur tweets:', tweetsError)
          throw tweetsError
        }

        // console.log(`✅ useThreadWithTweets: ${tweets?.length || 0} tweets récupérés`)

        // Fetch media files for this thread's tweets
        const tweetIds = tweets?.map(t => t.tweet_id) || []
        let mediaFiles: MediaFile[] = []
        
        if (tweetIds.length > 0) {
          const { data: media, error: mediaError } = await supabase
            .from('media_files')
            .select('*')
            .in('tweet_id', tweetIds)

          if (mediaError) {
            // console.error('⚠️ useThreadWithTweets: Erreur médias:', mediaError)
          } else {
            mediaFiles = media || []
            // console.log(`✅ useThreadWithTweets: ${mediaFiles.length} médias récupérés`)
          }
        } else {
          // console.log('⚠️ useThreadWithTweets: Aucun tweet, pas de médias à récupérer')
        }

        const finalThreadData = {
          ...thread,
          tweets: tweets || [],
          media_files: mediaFiles
        }

        // console.log('✅ useThreadWithTweets: Données complètes assemblées')
        setThreadData(finalThreadData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du thread'
        // console.error('❌ useThreadWithTweets: Erreur générale:', errorMessage)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchThreadWithTweets()
  }, [threadId])

  return { threadData, loading, error }
}

export function useSearch(query: string) {
  const [results, setResults] = useState<Thread[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    async function search() {
      try {
        setLoading(true)
        setError(null)

        // Search in threads by title, theme, or hashtags
        const { data, error } = await supabase
          .from('threads')
          .select('*')
          .or(`title.ilike.%${query}%,theme.ilike.%${query}%,description.ilike.%${query}%`)
          .order('date_created', { ascending: false })

        if (error) {
          throw error
        }

        setResults(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la recherche')
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(search, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [query])

  return { results, loading, error }
}

export function useSyncTwitter() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const syncNow = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.functions.invoke('twitter-sync', {
        body: {}
      })

      if (error) {
        throw error
      }

      console.log('Synchronisation réussie:', data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la synchronisation'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { syncNow, loading, error }
}