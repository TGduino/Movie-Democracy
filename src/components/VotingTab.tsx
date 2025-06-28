import {
  VStack,
  Text,
  Button,
  Box,
  List,
  ListItem,
  useToast,
  Grid,
  GridItem,
  Heading,
  Badge,
  Progress,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Center
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useState, useEffect } from 'react'
import { Participant } from '../types'

const confettiAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; }
`

interface VotingTabProps {
  participants: Participant[]
  votingOrder: Participant[]
}

export default function VotingTab({ participants, votingOrder }: VotingTabProps) {
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [localParticipants, setLocalParticipants] = useState<Participant[]>([])
  const [winner, setWinner] = useState<Participant | null>(null)
  const [tiedParticipants, setTiedParticipants] = useState<Participant[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    setLocalParticipants(participants.map(p => ({ ...p, votes: 0 })))
    setCurrentVoterIndex(0)
    setCurrentRound(1)
    setWinner(null)
    setTiedParticipants([])
  }, [participants])

  const currentVoter = votingOrder[currentVoterIndex]
  const isVotingComplete = currentVoterIndex >= votingOrder.length
  const totalVotes = localParticipants.reduce((sum, p) => sum + p.votes, 0)
  const maxPossibleVotes = votingOrder.length

  const handleVote = (votedFor: Participant) => {
    if (!currentVoter) return

    if (votedFor.name === currentVoter.name) {
      toast({
        title: 'Invalid Vote',
        description: 'You cannot vote for your own movie!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const updatedParticipants = localParticipants.map(p =>
      p.id === votedFor.id ? { ...p, votes: p.votes + 1 } : p
    )
    setLocalParticipants(updatedParticipants)
    setCurrentVoterIndex(currentVoterIndex + 1)

    if (currentVoterIndex + 1 >= votingOrder.length) {
      checkForWinner(updatedParticipants)
    }
  }

  const checkForWinner = (participants: Participant[]) => {
    const maxVotes = Math.max(...participants.map(p => p.votes))
    const winners = participants.filter(p => p.votes === maxVotes)

    if (winners.length === 1) {
      setWinner(winners[0])
      setTiedParticipants([])
      onOpen()
    } else {
      setWinner(null)
      setTiedParticipants(winners)
      onOpen()
    }
  }

  const handleNewGame = () => {
    window.location.reload()
  }

  const handleNextRound = () => {
    setLocalParticipants(tiedParticipants.map(p => ({ ...p, votes: 0 })))
    setCurrentVoterIndex(0)
    setCurrentRound(currentRound + 1)
    setWinner(null)
    setTiedParticipants([])
    onClose()
  }

  if (participants.length < 3) {
    return (
      <Box bg="gray.700" p={8} borderRadius="lg" boxShadow="md" textAlign="center">
        <Text color="gray.400" fontSize="lg">
          Add at least 3 participants in the Config tab to start voting
        </Text>
        <Text color="gray.500" fontSize="md" mt={2}>
          Currently have {participants.length} participant{participants.length !== 1 ? 's' : ''}, need {3 - participants.length} more
        </Text>
      </Box>
    )
  }

  return (
    <>
      <Grid templateColumns="1fr 2fr" gap={6}>
        <GridItem>
          <Box bg="gray.700" p={6} borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>Voting Order</Heading>
            <List spacing={2}>
              {votingOrder.map((voter, index) => (
                <ListItem
                  key={voter.id}
                  p={3}
                  bg={index === currentVoterIndex ? 'blue.500' : 'gray.600'}
                  color={index === currentVoterIndex ? 'white' : 'gray.200'}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  transition="all 0.2s"
                >
                  <Badge mr={2} colorScheme={index < currentVoterIndex ? 'green' : 'gray'}>
                    {index + 1}
                  </Badge>
                  {voter.name}
                  {index < currentVoterIndex && (
                    <Badge ml="auto" colorScheme="green">✓</Badge>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </GridItem>

        <GridItem>
          <VStack spacing={6}>
            <Box bg="gray.700" p={6} borderRadius="lg" boxShadow="md" width="100%">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Round {currentRound}</Heading>
                <Badge colorScheme="blue" p={2} borderRadius="md">
                  {totalVotes} / {maxPossibleVotes} votes
                </Badge>
              </Flex>
              
              {!isVotingComplete && currentVoter && (
                <Box mb={4}>
                  <Text fontSize="lg">
                    Current voter: <Text as="span" fontWeight="bold" color="blue.300">{currentVoter.name}</Text>
                  </Text>
                  <Progress value={(currentVoterIndex / votingOrder.length) * 100} size="sm" colorScheme="blue" mt={2} />
                </Box>
              )}

              <VStack spacing={4}>
                {localParticipants.map((participant) => (
                  <Button
                    key={participant.id}
                    onClick={() => handleVote(participant)}
                    isDisabled={isVotingComplete || !currentVoter || participant.name === currentVoter?.name}
                    size="lg"
                    width="100%"
                    variant={participant.name === currentVoter?.name ? "outline" : "solid"}
                    bg={participant.name === currentVoter?.name ? 'transparent' : 'gray.600'}
                    _hover={{
                      bg: participant.name === currentVoter?.name ? 'gray.700' : 'gray.500',
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg'
                    }}
                    transition="all 0.2s"
                  >
                    <Box flex="1" textAlign="left">
                      {participant.movieSuggestion}
                      <Badge ml={2} colorScheme="blue">{participant.votes} votes</Badge>
                    </Box>
                  </Button>
                ))}
              </VStack>
            </Box>
          </VStack>
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px)'
        />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalBody>
            <Center height="100vh" position="relative">
              <VStack
                bg="gray.800"
                p={12}
                borderRadius="2xl"
                boxShadow="2xl"
                spacing={8}
                position="relative"
                maxW="600px"
                w="90%"
                textAlign="center"
              >
                {/* Confetti elements */}
                {Array.from({ length: 50 }).map((_, i) => (
                  <Box
                    key={i}
                    position="absolute"
                    top="-20px"
                    left={`${Math.random() * 100}%`}
                    width="10px"
                    height="10px"
                    borderRadius="50%"
                    bg={`hsl(${Math.random() * 360}, 70%, 50%)`}
                    animation={`${confettiAnimation} ${1 + Math.random() * 2}s linear infinite`}
                    style={{ animationDelay: `${Math.random() * 2}s` }}
                  />
                ))}

                {winner ? (
                  <>
                    <Heading size="2xl" color="blue.300">
                      🎉 We Have a Winner! 🎉
                    </Heading>
                    
                    <VStack spacing={4}>
                      <Text fontSize="xl" color="gray.300">
                        The winning movie is
                      </Text>
                      <Heading size="lg" color="white">
                        {winner.movieSuggestion}
                      </Heading>
                      <Text fontSize="md" color="gray.400">
                        Suggested by {winner.name}
                      </Text>
                    </VStack>

                    <Button
                      onClick={handleNewGame}
                      colorScheme="blue"
                      size="lg"
                      _hover={{
                        transform: 'scale(1.05)',
                        boxShadow: 'xl'
                      }}
                      transition="all 0.2s"
                    >
                      Start New Game
                    </Button>
                  </>
                ) : (
                  <>
                    <Heading size="2xl" color="orange.300">
                      🤝 We Have a Tie! 🤝
                    </Heading>
                    
                    <VStack spacing={4}>
                      <Text fontSize="xl" color="gray.300">
                        The tied movies are:
                      </Text>
                      {tiedParticipants.map((participant) => (
                        <Box key={participant.id} p={4} bg="gray.700" borderRadius="lg" width="100%">
                          <Heading size="md" color="white">
                            {participant.movieSuggestion}
                          </Heading>
                          <Text fontSize="sm" color="gray.400" mt={2}>
                            Suggested by {participant.name}
                          </Text>
                        </Box>
                      ))}
                    </VStack>

                    <VStack spacing={4}>
                      <Button
                        onClick={handleNextRound}
                        colorScheme="orange"
                        size="lg"
                        _hover={{
                          transform: 'scale(1.05)',
                          boxShadow: 'xl'
                        }}
                        transition="all 0.2s"
                      >
                        Start Tie-Breaker Round
                      </Button>
                      <Button
                        onClick={handleNewGame}
                        variant="outline"
                        colorScheme="blue"
                        size="md"
                        _hover={{
                          transform: 'scale(1.05)',
                          boxShadow: 'xl'
                        }}
                        transition="all 0.2s"
                      >
                        Start New Game Instead
                      </Button>
                    </VStack>
                  </>
                )}
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
} 