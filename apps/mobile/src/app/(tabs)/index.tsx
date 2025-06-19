import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function HomeScreen() {
  return (
    <VStack className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold text-error-500">Hello World</Text>
    </VStack>
  );
}
