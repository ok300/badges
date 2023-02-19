import { useState } from "react";
import { useNostr } from "nostr-react-habla";

import {
  Box,
  Heading,
  Button,
  Avatar,
  AvatarBadge,
  Flex,
  Text,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import useRelays from "./useRelays";

function Relay({ url, isConnected }) {
  const { remove } = useRelays();
  const domain = url
    .replace("wss://relay.", "https://")
    .replace("wss://", "https://")
    .replace("ws://", "http://");
  return (
    <>
      <Flex alignItems="center" mb={2}>
        <Avatar size="xs" src={`${domain}/favicon.ico`}>
          {isConnected && <AvatarBadge boxSize="1.25em" bg="green.500" />}
        </Avatar>
        <Text ml={2}>{url}</Text>
        <DeleteIcon
          cursor="pointer"
          onClick={() => remove(url)}
          ml="auto"
          color="red.500"
          size="sm"
        />
      </Flex>
    </>
  );
}

export default function Relays(props) {
  const { connectedRelays } = useNostr();
  const connected = connectedRelays.map(({ url }) => url);

  const { relays } = useRelays();
  const [relay, setRelay] = useState("");
  const isValidRelay = relay.startsWith("ws://") || relay.startsWith("wss://");
  const { add } = useRelays();
  const handleClick = () => {
    add(relay);
    setRelay("");
  };

  return (
    <Box>
      <Heading mb={4} fontSize="2xl" as="h3">
        Relays
      </Heading>
      <Flex flexDirection={"column"} {...props}>
        {relays.map((url) => (
          <Relay isConnected={connected.includes(url)} key={url} url={url} />
        ))}
      </Flex>
      <InputGroup size="md" mb={6}>
        <Input
          pr="4.5rem"
          value={relay}
          onChange={(e) => setRelay(e.target.value)}
          placeholder="wss://relay.com"
        />
        <InputRightElement width="4.5rem">
          <Button
            isDisabled={!isValidRelay}
            h="1.75rem"
            size="sm"
            onClick={handleClick}
          >
            Add
          </Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}
