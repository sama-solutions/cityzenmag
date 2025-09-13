import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Thread, Tweet, MediaFile, ThreadWithTweets } from '../types/database'

// Function to extract title from tweet content
function extractTitleFromTweets(tweets: any[]): string | null {
  // Try to find the best title from the first few tweets
  for (const tweet of tweets) {
    const content = tweet.content
    
    // Remove common thread indicators and clean up
    let cleanContent = content
      .replace(/^\d+\/\d+\s*/, '') // Remove numbering like "1/9"
      .replace(/[👇🔎🧵⬇️]+/g, '') // Remove thread emojis
      .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
      .trim()
    
    // Split into sentences and find the best title candidate
    const sentences = cleanContent.split(/[.!?]\s+/)
    
    for (const sentence of sentences) {
      const cleanSentence = sentence
        .replace(/\n/g, ' ') // Replace line breaks with spaces
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim()
      
      // Check if this sentence could be a good title
      if (cleanSentence && 
          cleanSentence.length > 20 && 
          cleanSentence.length < 150 && 
          !cleanSentence.match(/^[👇🔎🧵⬇️\s]+$/) && // Not just emojis
          !cleanSentence.startsWith('@') && // Not a mention
          !cleanSentence.match(/^\d+\/\d+/) && // Not just numbering
          !cleanSentence.toLowerCase().includes('thread') && // Not meta-thread text
          !cleanSentence.toLowerCase().includes('voici') // Not intro text
      ) {
        // Clean up the title further
        let title = cleanSentence
          .replace(/^[^a-zA-ZÀ-ſĀ-ɏ]+/, '') // Remove leading non-letters
          .replace(/[.]{2,}/g, '...') // Normalize ellipsis
          .trim()
        
        // Ensure proper length
        if (title.length > 120) {
          title = title.substring(0, 120).trim()
          if (!title.endsWith('...')) {
            title += '...'
          }
        }
        
        return title
      }
    }
    
    // If no good sentence found, try the first meaningful line
    const lines = cleanContent.split('\n')
    for (const line of lines) {
      const cleanLine = line.trim()
      
      if (cleanLine && 
          cleanLine.length > 20 && 
          cleanLine.length < 120 && 
          !cleanLine.match(/^[👇🔎🧵⬇️\s]+$/) &&
          !cleanLine.startsWith('@') &&
          !cleanLine.match(/^\d+\/\d+/)
      ) {
        return cleanLine.replace(/\s+/g, ' ').trim()
      }
    }
  }
  
  return null
}

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

        // For each thread, get the featured image, Twitter publication date, and extract title from tweets
        const threadsWithImages = await Promise.all(
          threadsData.map(async (thread) => {
            try {
              // Get first few tweets of the thread to extract title and get publication date
              const { data: tweets, error: tweetError } = await supabase
                .from('tweets')
                .select('tweet_id, date_posted, content, position')
                .eq('thread_id', thread.thread_id)
                .order('date_posted', { ascending: true })
                .limit(3)

              let threadWithDate = { ...thread }
              
              if (!tweetError && tweets && tweets.length > 0) {
                const firstTweet = tweets[0]
                
                // Use Twitter publication date instead of thread creation date
                threadWithDate.date_created = firstTweet.date_posted
                
                // Extract title from tweet content
                const extractedTitle = extractTitleFromTweets(tweets)
                if (extractedTitle && extractedTitle.length > 10) {
                  threadWithDate.title = extractedTitle
                }
                
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
        
        console.log(`🔍 useThreadWithTweets: Récupération du thread ${threadId}`)
        
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

        console.log(`✅ useThreadWithTweets: ${tweets?.length || 0} tweets récupérés`)

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
            console.log(`✅ useThreadWithTweets: ${mediaFiles.length} médias récupérés`)
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

// Export alias for backward compatibility
export const useData = useThreads