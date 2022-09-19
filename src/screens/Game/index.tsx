import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameParams } from '../../@types/navigation';
import { Background } from '../../components/Background';
import { Entypo } from '@expo/vector-icons';

import logoImg from '../../assets/logo-nlw-esports.png';

import { styles } from './styles';
import { THEME } from '../../theme';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { DuoMatch } from '../../components/DuoMatch';

export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discord, setDiscord] = useState<string>('');
  const [discordDuoSelected, setDiscordDuoSelected] = useState(false);

  const route = useRoute();
  const game = route.params as GameParams;

  const navigation = useNavigation();

  useEffect(() => {
    const getDuos = async () => {
      const { data } = await axios(`http://192.168.15.7:3333/games/${game.id}/ads`);

      setDuos(data);
    }

    getDuos();
  }, [])

  function handleGoBack () {
    navigation.goBack();
  }

  async function getDiscordUser (adsId: string) {
    const { data } = await axios(`http://192.168.15.7:3333/ads/${adsId}/discord`);
    
    setDiscord(data.discord);
    setDiscordDuoSelected(true);
  }

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo 
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image
            source={logoImg}
            style={styles.logo}
          />

          <View style={styles.right}/>
        </View>

        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />

        <Heading
          title={game.title}
          subtitle="Conecte-se e comece a jogar!"
        />

        <FlatList
          data={duos}
          horizontal
          keyExtractor={item => item.id}
          style={styles.containerList}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
          renderItem={({ item }) => (
            <DuoCard
              data={item}
              onConnect={() => getDiscordUser(item.id)}
            />
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúnciso publicados ainda.
            </Text>
          )}
        />

        <DuoMatch
          visible={discordDuoSelected}
          discord={discord}
          onClose={() => setDiscordDuoSelected(false)}
        />
      </SafeAreaView>
    </Background>
  );
}