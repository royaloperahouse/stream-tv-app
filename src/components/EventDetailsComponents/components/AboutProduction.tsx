import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { scaleSize } from '@utils/scaleSize';
import { TEventContainer } from '@services/types/models';
import RohText from '@components/RohText';
import GoDown from '../commonControls/GoDown';
import get from 'lodash.get';
import { Colors } from '@themes/Styleguide';
import MultiColumnAboutProductionList, {
  ECellItemKey,
} from '../commonControls/MultiColumnAboutProductionList';

type AboutProductionProps = {
  event: TEventContainer;
  nextScreenText: string;
  setScreenAvailabilety: (screenName: string, availabilety?: boolean) => void;
  screenName: string;
};

const AboutProduction: React.FC<AboutProductionProps> = ({
  event,
  nextScreenText,
  screenName,
  setScreenAvailabilety,
}) => {
  const aboutProduction: Array<{
    key: string;
    type: ECellItemKey;
    content: any;
  }> = [];

  const language = get(event.data, 'vs_event_details.productions', []).reduce(
    (acc: string, item: any, index: number) => {
      if (item?.attributes?.language) {
        acc += (index !== 0 ? ', ' : '') + item.attributes.language;
      }
      return acc;
    },
    '',
  );

  const guidance: Array<string> = event.data.vs_guidance_details.reduce(
    (acc: Array<string>, item: any) => {
      if (item.text) {
        acc.push(item.text);
      }
      return acc;
    },
    event.data.vs_guidance ? [event.data.vs_guidance] : [],
  );

  const genres = event.data.vs_genres.reduce(
    (acc: string, item: any, index: number) => {
      if (item.tag) {
        acc += (index !== 0 ? ', ' : '') + item.tag;
      }
      return acc;
    },
    '',
  );

  const sponsors = event.data.vs_sponsors.reduce((acc: Array<any>, item) => {
    const sponsor: Partial<{
      img: { url: string; width: number; height: number };
      info: { title: string; description: string };
    }> = {};
    if (
      item?.sponsor_logo?.url &&
      item?.sponsor_logo?.dimensions?.width &&
      item?.sponsor_logo?.dimensions?.height
    ) {
      sponsor.img = {
        url: item.sponsor_logo.url,
        width: item.sponsor_logo.dimensions.width,
        height: item.sponsor_logo.dimensions.height,
      };
    }
    const sponsorTitle = item.sponsor_title.reduce(
      (title: string, titleItem) => {
        if (titleItem.text) {
          title += titleItem.text;
        }
        return title;
      },
      '',
    );

    const sponsorIntro = item.sponsor_intro.reduce(
      (intro: string, introItem) => {
        if (introItem.text) {
          intro += introItem.text;
        }
        return intro;
      },
      '',
    );

    const sponsorDesccription = item.sponsor_description.reduce(
      (description: string, descriptionItem) => {
        if (descriptionItem.text) {
          description += descriptionItem.text + '\n';
        }
        return description;
      },
      '',
    );
    const info = {
      title: sponsorTitle || sponsorIntro,
      description: sponsorDesccription,
    };
    if (info.title && info.description) {
      sponsor.info = info;
    }
    if (sponsor.img || sponsor.info) {
      acc.push(sponsor);
    }
    return acc;
  }, []);

  if (language) {
    aboutProduction.push({
      key: ECellItemKey.language,
      type: ECellItemKey.language,
      content: language,
    });
  }

  if (guidance.length) {
    aboutProduction.push({
      key: ECellItemKey.guidance,
      type: ECellItemKey.guidance,
      content: guidance.join('\n'),
    });
  }

  if (genres) {
    aboutProduction.push({
      key: ECellItemKey.genres,
      type: ECellItemKey.genres,
      content: genres,
    });
  }

  if (sponsors.length) {
    aboutProduction.push(
      ...sponsors.map((sponsor, index) => ({
        key: ECellItemKey.sponsor + index,
        type: ECellItemKey.sponsor,
        content: sponsor,
      })),
    );
  }

  useLayoutEffect(() => {
    setScreenAvailabilety(screenName, Boolean(aboutProduction.length));
    return () => {
      setScreenAvailabilety(screenName);
    };
  }, [aboutProduction.length, screenName, setScreenAvailabilety]);

  if (!aboutProduction.length) {
    return null;
  }

  return (
    <View style={styles.generalContainer}>
      <View style={styles.downContainer}>
        <GoDown text={nextScreenText} />
      </View>
      <View style={styles.wrapper}>
        <RohText style={styles.title}>About the Production</RohText>
        <View style={styles.aboutTheProductionContainer}>
          <MultiColumnAboutProductionList
            data={aboutProduction}
            columnWidth={scaleSize(740)}
            columnHeight={scaleSize(770)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    height: Dimensions.get('window').height,
    paddingRight: scaleSize(200),
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downContainer: {
    flexDirection: 'row',
    height: scaleSize(50),
    paddingBottom: scaleSize(60),
    top: -scaleSize(85),
  },
  title: {
    flex: 1,
    color: Colors.defaultTextColor,
    fontSize: scaleSize(72),
    textTransform: 'uppercase',
    letterSpacing: scaleSize(1),
    lineHeight: scaleSize(84),
  },
  aboutTheProductionContainer: {
    height: scaleSize(770),
    width: scaleSize(740),
  },
});

export default AboutProduction;
