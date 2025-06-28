import {
  Button,
  VStack,
  HStack,
  Input,
  Text,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
  Heading,
  Flex
} from '@chakra-ui/react'
import { useState, useRef, KeyboardEvent } from 'react'
import { Participant } from '../types'

interface ConfigTabProps {
  participants: Participant[]
  onParticipantsUpdate: (participants: Participant[]) => void
}

interface EditingState {
  id: string | null
  field: 'name' | 'movie' | null
  value: string
}

export default function ConfigTab({ participants, onParticipantsUpdate }: ConfigTabProps) {
  const [name, setName] = useState('')
  const [movieSuggestion, setMovieSuggestion] = useState('')
  const [editing, setEditing] = useState<EditingState>({ id: null, field: null, value: '' })
  const nameInputRef = useRef<HTMLInputElement>(null)
  const movieInputRef = useRef<HTMLInputElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleAddParticipant = () => {
    if (!name || !movieSuggestion) {
      toast({
        title: 'Error',
        description: 'Please fill in both name and movie suggestion',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      nameInputRef.current?.focus()
      return
    }

    // Check for duplicate names
    const nameExists = participants.some(p => p.name.toLowerCase() === name.toLowerCase())
    if (nameExists) {
      toast({
        title: 'Duplicate Name',
        description: 'This name is already taken. Please choose a different name.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      nameInputRef.current?.focus()
      return
    }

    // Check for duplicate movies
    const movieExists = participants.some(p => p.movieSuggestion.toLowerCase() === movieSuggestion.toLowerCase())
    if (movieExists) {
      toast({
        title: 'Duplicate Movie',
        description: 'This movie has already been suggested. Please choose a different movie.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      movieInputRef.current?.focus()
      return
    }

    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: name.trim(),
      movieSuggestion: movieSuggestion.trim(),
      votes: 0,
    }

    onParticipantsUpdate([...participants, newParticipant])
    setName('')
    setMovieSuggestion('')
    nameInputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, currentInput: 'name' | 'movie') => {
    if (e.key === 'Enter') {
      handleAddParticipant()
    } else if (e.key === 'Tab') {
      e.preventDefault() // Prevent default tab behavior
      if (currentInput === 'name') {
        movieInputRef.current?.focus()
      } else {
        nameInputRef.current?.focus()
      }
    }
  }

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>, participant: Participant) => {
    if (e.key === 'Enter') {
      handleSaveEdit(participant)
    } else if (e.key === 'Escape') {
      setEditing({ id: null, field: null, value: '' })
    }
  }

  const startEditing = (participant: Participant, field: 'name' | 'movie') => {
    setEditing({
      id: participant.id,
      field,
      value: field === 'name' ? participant.name : participant.movieSuggestion
    })
    // Focus the input on the next render
    setTimeout(() => {
      editInputRef.current?.focus()
    }, 0)
  }

  const handleSaveEdit = (participant: Participant) => {
    if (!editing.value.trim()) {
      toast({
        title: 'Error',
        description: `${editing.field === 'name' ? 'Name' : 'Movie'} cannot be empty`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Check for duplicates
    const isDuplicate = participants.some(p => {
      if (p.id === participant.id) return false // Don't check against self
      return editing.field === 'name'
        ? p.name.toLowerCase() === editing.value.toLowerCase()
        : p.movieSuggestion.toLowerCase() === editing.value.toLowerCase()
    })

    if (isDuplicate) {
      toast({
        title: 'Duplicate Entry',
        description: `This ${editing.field === 'name' ? 'name' : 'movie'} is already taken`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const updatedParticipants = participants.map(p => {
      if (p.id === participant.id) {
        return {
          ...p,
          [editing.field === 'name' ? 'name' : 'movieSuggestion']: editing.value.trim()
        }
      }
      return p
    })

    onParticipantsUpdate(updatedParticipants)
    setEditing({ id: null, field: null, value: '' })
  }

  const handleRemoveParticipant = (id: string) => {
    onParticipantsUpdate(participants.filter(p => p.id !== id))
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box bg="gray.700" p={6} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={4}>Add Participants</Heading>
        <VStack spacing={4}>
          <HStack spacing={4} width="100%">
            <Input
              ref={nameInputRef}
              placeholder="Participant Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'name')}
              bg="gray.600"
              _hover={{ bg: 'gray.500' }}
              _focus={{ bg: 'gray.500', borderColor: 'blue.300' }}
              autoFocus
            />
            <Input
              ref={movieInputRef}
              placeholder="Movie Suggestion"
              value={movieSuggestion}
              onChange={(e) => setMovieSuggestion(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'movie')}
              bg="gray.600"
              _hover={{ bg: 'gray.500' }}
              _focus={{ bg: 'gray.500', borderColor: 'blue.300' }}
            />
            <Button 
              ref={addButtonRef}
              colorScheme="blue" 
              onClick={handleAddParticipant}
              px={8}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Add
            </Button>
          </HStack>
        </VStack>
      </Box>

      {participants.length > 0 ? (
        <Box bg="gray.700" p={6} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>Participants List</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th color="gray.300">Name</Th>
                <Th color="gray.300">Movie Suggestion</Th>
                <Th color="gray.300" width="100px">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {participants.map((participant) => (
                <Tr key={participant.id} _hover={{ bg: 'gray.600' }}>
                  <Td>
                    {editing.id === participant.id && editing.field === 'name' ? (
                      <Input
                        ref={editInputRef}
                        value={editing.value}
                        onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                        onKeyDown={(e) => handleEditKeyDown(e, participant)}
                        onBlur={() => handleSaveEdit(participant)}
                        bg="gray.600"
                        _hover={{ bg: 'gray.500' }}
                        _focus={{ bg: 'gray.500', borderColor: 'blue.300' }}
                      />
                    ) : (
                      <Text
                        cursor="pointer"
                        onClick={() => startEditing(participant, 'name')}
                        _hover={{ color: 'blue.300' }}
                      >
                        {participant.name}
                      </Text>
                    )}
                  </Td>
                  <Td>
                    {editing.id === participant.id && editing.field === 'movie' ? (
                      <Input
                        ref={editInputRef}
                        value={editing.value}
                        onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                        onKeyDown={(e) => handleEditKeyDown(e, participant)}
                        onBlur={() => handleSaveEdit(participant)}
                        bg="gray.600"
                        _hover={{ bg: 'gray.500' }}
                        _focus={{ bg: 'gray.500', borderColor: 'blue.300' }}
                      />
                    ) : (
                      <Text
                        cursor="pointer"
                        onClick={() => startEditing(participant, 'movie')}
                        _hover={{ color: 'blue.300' }}
                      >
                        {participant.movieSuggestion}
                      </Text>
                    )}
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Remove participant"
                      icon={<span>🗑️</span>}
                      onClick={() => handleRemoveParticipant(participant.id)}
                      variant="ghost"
                      colorScheme="red"
                      _hover={{ bg: 'red.600' }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Box bg="gray.700" p={6} borderRadius="lg" boxShadow="md" textAlign="center">
          <Text color="gray.400">
            Add at least 3 participants in the Config tab to start voting!
          </Text>
          <Text color="gray.500" fontSize="sm" mt={2}>
            Each participant suggests one movie to watch
          </Text>
        </Box>
      )}
    </VStack>
  )
} 