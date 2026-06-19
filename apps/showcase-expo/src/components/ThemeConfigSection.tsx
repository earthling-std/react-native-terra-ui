import {
  Box,
  Button,
  getAccentNames,
  Text,
  useTheme,
} from 'react-native-terra-ui';

export function ThemeConfigSection() {
  const { scheme, setScheme, accent, setAccent } = useTheme();
  const accents = getAccentNames();

  return (
    <Box gap="2">
      <Text variant="label-sm" color="content.tertiary">
        Theme
      </Text>
      <Box row gap="2" wrap>
        <Button
          size="sm"
          variant="outline"
          fullWidth={false}
          onPress={() => setScheme(scheme === 'light' ? 'dark' : 'light')}
        >
          {scheme}
        </Button>
        {accents.map((name) => (
          <Button
            key={name}
            size="sm"
            variant={accent === name ? 'primary' : 'outline'}
            fullWidth={false}
            onPress={() => setAccent(name)}
          >
            {name}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
