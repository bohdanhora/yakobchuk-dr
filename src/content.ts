import type { Tracks } from './hooks/useMusic'

export type Photo = {
  src: string | null
  caption: string
}

export type Reason = {
  front: string
  back: string
}

export const content = {
  name: 'Елизавета',
  initials: 'ЕЯ',
  birthday: { year: 2026, month: 11, day: 24 },
  music: {
    main: '/music/salvatore.mp3',
    scroll: '/music/kak-budto-my-s-toboy.mp3',
  } as Tracks | null,

  countdown: {
    eyebrow: 'Для Елизаветы',
    title: 'Письмо ещё в пути',
    subtitle: 'Оно откроется 24 ноября, ровно в полночь',
  },

  envelope: {
    eyebrow: 'Лично в руки',
    title: 'Тебе письмо',
    addressee: 'Елизавете',
    hint: 'Коснись печати',
  },

  intro: {
    lines: [
      'Есть дни, которые принадлежат всем.',
      'А есть дни, которые принадлежат одному человеку.',
      'Сегодня именно такой день.',
      'И он весь твой.',
    ],
  },

  hero: {
    eyebrow: 'Двадцать четвёртое ноября',
    greeting: 'С днём рождения',
    tagline: 'Сегодня весь мир немного вращается вокруг тебя',
    scrollHint: 'листай вниз',
  },

  letter: {
    title: 'Дорогая Лиза,',
    paragraphs: [
      'Здесь будет первый абзац поздравления. Пара тёплых слов о том, какой сегодня особенный день.',
      'Здесь будет второй абзац. Воспоминания, пожелания и всё самое важное.',
      'Здесь будет третий абзац. Короткий и трогательный финал письма.',
    ],
    signature: 'С любовью',
  },

  photos: {
    eyebrow: 'Наши моменты',
    title: 'Немного воспоминаний',
    hint: 'Нажми на фото, чтобы рассмотреть',
    items: [
      { src: null, caption: 'Подпись к фото 1' },
      { src: null, caption: 'Подпись к фото 2' },
      { src: null, caption: 'Подпись к фото 3' },
      { src: null, caption: 'Подпись к фото 4' },
      { src: null, caption: 'Подпись к фото 5' },
      { src: null, caption: 'Подпись к фото 6' },
    ] satisfies Photo[],
  },

  reasons: {
    eyebrow: 'Нажми на карточку',
    title: 'За что мы тебя любим',
    items: [
      { front: 'Причина первая', back: 'Текст первой причины' },
      { front: 'Причина вторая', back: 'Текст второй причины' },
      { front: 'Причина третья', back: 'Текст третьей причины' },
      { front: 'Причина четвёртая', back: 'Текст четвёртой причины' },
      { front: 'Причина пятая', back: 'Текст пятой причины' },
      { front: 'Причина шестая', back: 'Текст шестой причины' },
    ] satisfies Reason[],
  },

  cake: {
    eyebrow: 'Последний шаг',
    title: 'Загадай желание',
    hint: 'и задуй свечи',
    micButton: 'Задуть по-настоящему',
    listening: 'Подуй на экран',
    tapHint: 'или коснись каждой свечи',
    denied: 'Микрофон недоступен, просто коснись свечей',
    candles: 5,
  },

  finale: {
    title: 'Пусть всё сбудется!',
    text: 'Здесь будут финальные слова поздравления.',
    signature: 'Твои близкие',
    replay: 'Зажечь свечи ещё раз',
  },
}
