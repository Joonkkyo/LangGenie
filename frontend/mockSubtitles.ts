export const demoSubtitles = [
  { 
    id: "sub-1",
    start: 185.0, 
    end: 189.0, 
    text: "It puts them at a greater risk of stroke, heart disease, diabetes, dementia, depression, and early death." 
  },
  { 
    id: "sub-2",
    start: 189.0, 
    end: 195.0, 
    text: "Social health is essential for longevity." 
  },
  { 
    id: "sub-3",
    start: 195.0, 
    end: 200.0, 
    text: "So you might be wondering, what does it look like to be socially healthy?" 
  },
  {
    id: "sub-4",
    start: 200.0,
    end: 202.5,
    text: "What does that even mean?"
  },
  {
    id: "sub-5",
    start: 202.5,
    end: 207.5,
    text: "Well it's about developing close relationships with your family, your friends, your partner, yourself."
  },
  {
    id: "sub-6",
    start: 207.5,
    end: 213.0,
    text: "It's about having regular interaction with your co-workers, your neighbors."
  },
  {
    id: "sub-7",
    start: 213.0,
    end: 215.0,
    text: "It's about feeling like you belong to a community."
  },
  {
    id: "sub-8",
    start: 215.0,
    end: 222.0,
    text: "Being socially healthy is about having the right quantity and quality of connection for you."
  },
  {
    id: "sub-9",
    start: 222.0,
    end: 228.0,
    text: "And Maya's story is one example of how social health challenges come up in my work."
  },
  {
    id: "sub-10",
    start: 228.0,
    end: 232.0,
    text: "I hear many others' stories, like Jay, a freshman in college,"
  },
  {
    id: "sub-11",
    start: 232.0,
    end: 238.0,
    text: "who's eager to get involved in campus, yet is having a hard time fitting in with people in his dorm."
  }
];

export const demoVocab: Record<string, any[]> = {
  "sub-1": [
    { word: "dementia", meaning: "치매", context: "diabetes, dementia, depression", pronunciation: "/dɪˈmen.ʃə/" }
  ],
  "sub-2": [
    { word: "longevity", meaning: "장수, 수명", context: "essential for longevity", pronunciation: "/lɒnˈdʒev.ə.ti/" }
  ],
  "sub-5": [
    { word: "relationship", meaning: "관계, 연관성", context: "developing close relationships", pronunciation: "/rɪˈleɪ.ʃən.ʃɪp/" }
  ],
  "sub-6": [
    { word: "interaction", meaning: "상호작용, 소통", context: "having regular interaction", pronunciation: "/ˌɪn.təˈræk.ʃən/" }
  ],
  "sub-7": [
    { word: "belong", meaning: "소속되다, 속하다", context: "you belong to a community", pronunciation: "/bɪˈlɒŋ/" }
  ],
  "sub-11": [
    { word: "freshman", meaning: "신입생", context: "a freshman in college", pronunciation: "/ˈfreʃ.mən/" },
    { word: "eager", meaning: "간절히 바라는, 열렬한", context: "eager to get involved", pronunciation: "/ˈiː.ɡər/" }
  ]
};

export const demoGrammar: Record<string, any> = {
  "sub-1": { point: "at a greater risk of ~", explanation: "~의 위험이 더 크다", example: "Smokers are at a greater risk of heart disease." },
  "sub-2": { point: "be essential for ~", explanation: "~에 필수적이다", example: "Water is essential for life." },
  "sub-5": { point: "be about ~ing", explanation: "~하는 것에 관한 것이다", example: "Leadership is about empowering others." },
  "sub-11": { point: "have a hard time ~ing", explanation: "~하는 데 어려움을 겪다", example: "I had a hard time finding your house." }
};
