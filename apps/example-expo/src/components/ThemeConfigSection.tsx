import {
  Button,
  getAccentNames,
  HStack,
  Text,
  useTheme,
  VStack,
} from 'react-native-terra-ui';

export function ThemeConfigSection() {
  const { scheme, setScheme, accent, setAccent } = useTheme();
  const accents = getAccentNames();

  return (
    <VStack gap="2">
      <Text variant="label-sm" color="content.tertiary">
        Theme
      </Text>
      <HStack gap="2" wrap>
        <Button
          size="sm"
          variant="outline"
          onPress={() => setScheme(scheme === 'light' ? 'dark' : 'light')}
        >
          {scheme}
        </Button>
        {accents.map((name) => (
          <Button
            key={name}
            size="sm"
            variant={accent === name ? 'primary' : 'outline'}
            onPress={() => setAccent(name)}
          >
            {name}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
}
