import type { Tracks } from './hooks/useMusic'

export type Photo = {
  src: string | null
  caption: string
}

export type StoryChoice = {
  label: string
  reply: string
  special?: boolean
}

export type StoryLine = {
  text: string
  choices?: StoryChoice[]
}

export type StoryCharacter = {
  id: string
  name: string
  tagline: string
  portrait: string | null
  accent: string
  lines: StoryLine[]
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

  puzzle: {
    eyebrow: 'Последний замок',
    title: 'Собери квадрат',
    subtitle: 'Перетащи все фигуры на поле так, чтобы не осталось ни одной пустой клетки',
    hint: 'Подсказка',
    reset: 'Начать заново',
    solved: 'Получилось!',
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

  story: {
    eyebrow: 'Особые гости',
    title: 'Тебя хотят поздравить',
    subtitle: 'Но поздравить тебя сможет только один из них',
    open: 'Выбрать',
    chooseTitle: 'Кто поздравит тебя?',
    chooseWarning: 'Выбрать можно только одного. Подумай хорошо: передумать не получится',
    confirmTitle: 'Это твой выбор?',
    confirmText: 'После этого изменить решение будет нельзя',
    confirmYes: 'Да, это он',
    confirmNo: 'Подумать ещё',
    chosenLabel: 'Твой выбор',
    chosenSubtitle: 'Выбор сделан. Он всегда будет ждать тебя здесь',
    reopen: 'Открыть снова',
    replay: 'Ещё раз',
    close: 'К открытке',
    signature: 'С днём рождения!',
    characters: [
      {
        id: 'hero1',
        name: 'Голод',
        tagline: 'Короткая характеристика',
        portrait: '/characters/golod.webp',
        accent: '#b23a4c',
        lines: [
          { text: 'Здесь будет первая реплика первого персонажа.' },
          {
            text: 'Здесь будет вопрос, на который можно ответить.',
            choices: [
              { label: 'Первый вариант ответа', reply: 'Реакция на первый вариант.' },
              { label: 'Особый вариант', reply: 'Реакция на особый вариант.', special: true },
            ],
          },
          { text: 'Здесь будет поздравление от первого персонажа.' },
        ],
      },
      {
        id: 'hero2',
        name: 'Доран',
        tagline: 'Короткая характеристика',
        portrait: '/characters/doran.webp',
        accent: '#7d5f30',
        lines: [
          { text: 'Здесь будет первая реплика второго персонажа.' },
          {
            text: 'Здесь будет вопрос, на который можно ответить.',
            choices: [
              { label: 'Первый вариант ответа', reply: 'Реакция на первый вариант.' },
              { label: 'Особый вариант', reply: 'Реакция на особый вариант.', special: true },
            ],
          },
          { text: 'Здесь будет поздравление от второго персонажа.' },
        ],
      },
      {
        id: 'hero3',
        name: 'Дмитрий',
        tagline: 'Короткая характеристика',
        portrait: '/characters/dmit.webp',
        accent: '#4e1f44',
        lines: [
          { text: 'Здесь будет первая реплика третьего персонажа.' },
          { text: 'Здесь будет поздравление от третьего персонажа.' },
        ],
      },
      {
        id: 'hero4',
        name: 'Ашриэль Карн',
        tagline: 'Короткая характеристика',
        portrait: '/characters/ash.webp',
        accent: '#2a0610',
        lines: [
          { text: 'Здесь будет первая реплика четвёртого персонажа.' },
          { text: 'Здесь будет поздравление от четвёртого персонажа.' },
        ],
      },
    ] satisfies StoryCharacter[],
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
