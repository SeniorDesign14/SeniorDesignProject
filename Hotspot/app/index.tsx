import { Text, View } from "react-native";
import { useRouter, Redirect } from 'expo-router';

// direct to tabs list when bootup
// export default function Index() {
//   return (
//     <Redirect href="/(tabs)/dining" />
//   );
// }
 // direct to login screen when bootup
export default function Index() {
  return (
    <Redirect href="/login" />
  );
}