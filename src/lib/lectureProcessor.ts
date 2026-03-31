export type SupportedLanguageCode = "en" | "ta" | "hi";

export interface LectureEngineOutput {
  detected_language: string;
  clean_transcript: string;
  translated_text: string;
  keywords: string[];
  short_summary: string;
  detailed_summary: string[];
}

export interface LectureProcessingBuffer {
  finalizedSegments: string[];
  activeSegment: string;
}

interface MultilingualSentence {
  id: string;
  sentences: Record<SupportedLanguageCode, string>;
  chunks: Record<SupportedLanguageCode, string[]>;
}

interface ConceptDefinition {
  labels: Record<SupportedLanguageCode, string>;
  forms: Record<SupportedLanguageCode, string[]>;
}

const LANGUAGE_LABELS: Record<SupportedLanguageCode, string> = {
  en: "English",
  ta: "Tamil",
  hi: "Hindi",
};

const DEMO_SENTENCES: MultilingualSentence[] = [
  {
    id: "neural-intro",
    sentences: {
      en: "Today we'll explore the fundamentals of neural networks and how they learn from data.",
      ta: "இன்று நரம்பியல் வலைகளின் அடிப்படைகளையும், அவை தரவிலிருந்து எப்படி கற்கின்றன என்பதையும் பார்க்கப் போகிறோம்.",
      hi: "आज हम न्यूरल नेटवर्क के मूल सिद्धांतों और यह डेटा से कैसे सीखते हैं, इसे समझेंगे।",
    },
    chunks: {
      en: [
        "Today we'll explore the fundamentals",
        "of neural networks and how they",
        "learn from data.",
      ],
      ta: [
        "இன்று நரம்பியல் வலைகளின் அடிப்படைகளையும்,",
        "அவை தரவிலிருந்து எப்படி கற்கின்றன",
        "என்பதையும் பார்க்கப் போகிறோம்.",
      ],
      hi: [
        "आज हम न्यूरल नेटवर्क के मूल सिद्धांतों",
        "और यह डेटा से कैसे सीखते हैं,",
        "इसे समझेंगे।",
      ],
    },
  },
  {
    id: "network-structure",
    sentences: {
      en: "Neural networks consist of layers of interconnected nodes that perform simple computations.",
      ta: "நரம்பியல் வலைகள் எளிய கணக்கீடுகளை செய்யும் ஒன்றுடன் ஒன்று இணைந்த நோடுகளின் அடுக்குகளால் உருவாகின்றன.",
      hi: "न्यूरल नेटवर्क ऐसी परतों से बने होते हैं जिनमें जुड़े हुए नोड सरल गणनाएँ करते हैं।",
    },
    chunks: {
      en: [
        "Neural networks consist of layers",
        "of interconnected nodes",
        "that perform simple computations.",
      ],
      ta: [
        "நரம்பியல் வலைகள் எளிய கணக்கீடுகளை செய்யும்",
        "ஒன்றுடன் ஒன்று இணைந்த நோடுகளின்",
        "அடுக்குகளால் உருவாகின்றன.",
      ],
      hi: [
        "न्यूरल नेटवर्क ऐसी परतों से बने होते हैं",
        "जिनमें जुड़े हुए नोड",
        "सरल गणनाएँ करते हैं।",
      ],
    },
  },
  {
    id: "backpropagation",
    sentences: {
      en: "Backpropagation calculates gradients by applying the chain rule of calculus.",
      ta: "பின்பரப்பு முறை கல்குலஸின் சங்கிலி விதியை பயன்படுத்தி கிரேடியன்ட்களை கணக்கிடுகிறது.",
      hi: "बैकप्रोपेगेशन कलन के चेन रूल का उपयोग करके ग्रेडिएंट की गणना करता है।",
    },
    chunks: {
      en: [
        "Backpropagation calculates gradients",
        "by applying the chain rule",
        "of calculus.",
      ],
      ta: [
        "பின்பரப்பு முறை",
        "கல்குலஸின் சங்கிலி விதியை பயன்படுத்தி",
        "கிரேடியன்ட்களை கணக்கிடுகிறது.",
      ],
      hi: [
        "बैकप्रोपेगेशन",
        "कलन के चेन रूल का उपयोग करके",
        "ग्रेडिएंट की गणना करता है।",
      ],
    },
  },
  {
    id: "gradient-descent",
    sentences: {
      en: "Gradient descent helps the model minimize the loss function during training.",
      ta: "பயிற்சியின் போது லாஸ் செயல்பாட்டை குறைக்க கிரேடியன்ட் டிசென்ட் மாதிரிக்கு உதவுகிறது.",
      hi: "प्रशिक्षण के दौरान लॉस फ़ंक्शन को कम करने में ग्रेडिएंट डिसेंट मॉडल की मदद करता है।",
    },
    chunks: {
      en: [
        "Gradient descent helps the model",
        "minimize the loss function",
        "during training.",
      ],
      ta: [
        "கிரேடியன்ட் டிசென்ட் மாதிரிக்கு",
        "லாஸ் செயல்பாட்டை குறைக்க",
        "பயிற்சியின் போது உதவுகிறது.",
      ],
      hi: [
        "ग्रेडिएंट डिसेंट मॉडल की",
        "लॉस फ़ंक्शन को कम करने में",
        "प्रशिक्षण के दौरान मदद करता है।",
      ],
    },
  },
  {
    id: "activation",
    sentences: {
      en: "Activation functions such as ReLU introduce non-linearity into the network.",
      ta: "ReLU போன்ற செயல்படுத்தும் செயல்பாடுகள் வலையில் நேர்மையற்ற தன்மையை கொண்டு வருகின்றன.",
      hi: "ReLU जैसे एक्टिवेशन फ़ंक्शन नेटवर्क में नॉन-लिनियरिटी लाते हैं।",
    },
    chunks: {
      en: [
        "Activation functions such as ReLU",
        "introduce non-linearity",
        "into the network.",
      ],
      ta: [
        "ReLU போன்ற செயல்படுத்தும் செயல்பாடுகள்",
        "வலையில் நேர்மையற்ற தன்மையை",
        "கொண்டு வருகின்றன.",
      ],
      hi: [
        "ReLU जैसे एक्टिवेशन फ़ंक्शन",
        "नेटवर्क में नॉन-लिनियरिटी",
        "लाते हैं।",
      ],
    },
  },
  {
    id: "transformer",
    sentences: {
      en: "Transformer models use attention to focus on the most relevant parts of the input.",
      ta: "டிரான்ஸ்ஃபார்மர் மாதிரிகள் உள்ளீட்டின் மிக முக்கியமான பகுதிகளில் கவனம் செலுத்த அட்டென்ஷனை பயன்படுத்துகின்றன.",
      hi: "ट्रांसफॉर्मर मॉडल इनपुट के सबसे महत्वपूर्ण हिस्सों पर ध्यान देने के लिए अटेंशन का उपयोग करते हैं।",
    },
    chunks: {
      en: [
        "Transformer models use attention",
        "to focus on the most relevant parts",
        "of the input.",
      ],
      ta: [
        "டிரான்ஸ்ஃபார்மர் மாதிரிகள்",
        "உள்ளீட்டின் மிக முக்கியமான பகுதிகளில்",
        "கவனம் செலுத்த அட்டென்ஷனை பயன்படுத்துகின்றன.",
      ],
      hi: [
        "ट्रांसफॉर्मर मॉडल",
        "इनपुट के सबसे महत्वपूर्ण हिस्सों पर",
        "ध्यान देने के लिए अटेंशन का उपयोग करते हैं।",
      ],
    },
  },
];

const CONCEPTS: ConceptDefinition[] = [
  {
    labels: {
      en: "Neural Networks",
      ta: "நரம்பியல் வலைகள்",
      hi: "न्यूरल नेटवर्क",
    },
    forms: {
      en: ["neural network", "neural networks"],
      ta: ["நரம்பியல் வலை", "நரம்பியல் வலைகள்"],
      hi: ["न्यूरल नेटवर्क", "न्यूरल नेटवर्क्स"],
    },
  },
  {
    labels: {
      en: "Data",
      ta: "தரவு",
      hi: "डेटा",
    },
    forms: {
      en: ["data"],
      ta: ["தரவு", "தரவிலிருந்து"],
      hi: ["डेटा"],
    },
  },
  {
    labels: {
      en: "Layers",
      ta: "அடுக்குகள்",
      hi: "परतें",
    },
    forms: {
      en: ["layer", "layers"],
      ta: ["அடுக்குகள்"],
      hi: ["परत", "परतों"],
    },
  },
  {
    labels: {
      en: "Nodes",
      ta: "நோடுகள்",
      hi: "नोड",
    },
    forms: {
      en: ["node", "nodes"],
      ta: ["நோடு", "நோடுகள்"],
      hi: ["नोड", "नोडों"],
    },
  },
  {
    labels: {
      en: "Backpropagation",
      ta: "பின்பரப்பு முறை",
      hi: "बैकप्रोपेगेशन",
    },
    forms: {
      en: ["backpropagation"],
      ta: ["பின்பரப்பு"],
      hi: ["बैकप्रोपेगेशन"],
    },
  },
  {
    labels: {
      en: "Gradients",
      ta: "கிரேடியன்ட்கள்",
      hi: "ग्रेडिएंट",
    },
    forms: {
      en: ["gradient", "gradients"],
      ta: ["கிரேடியன்ட்", "கிரேடியன்ட்கள்"],
      hi: ["ग्रेडिएंट", "ग्रेडिएंट्स"],
    },
  },
  {
    labels: {
      en: "Gradient Descent",
      ta: "கிரேடியன்ட் டிசென்ட்",
      hi: "ग्रेडिएंट डिसेंट",
    },
    forms: {
      en: ["gradient descent"],
      ta: ["கிரேடியன்ட் டிசென்ட்"],
      hi: ["ग्रेडिएंट डिसेंट"],
    },
  },
  {
    labels: {
      en: "Loss Function",
      ta: "லாஸ் செயல்பாடு",
      hi: "लॉस फ़ंक्शन",
    },
    forms: {
      en: ["loss function"],
      ta: ["லாஸ் செயல்பாடு"],
      hi: ["लॉस फ़ंक्शन"],
    },
  },
  {
    labels: {
      en: "Activation Functions",
      ta: "செயல்படுத்தும் செயல்பாடுகள்",
      hi: "एक्टिवेशन फ़ंक्शन",
    },
    forms: {
      en: ["activation function", "activation functions"],
      ta: ["செயல்படுத்தும் செயல்பாடு", "செயல்படுத்தும் செயல்பாடுகள்"],
      hi: ["एक्टिवेशन फ़ंक्शन", "एक्टिवेशन फ़ंक्शन्स"],
    },
  },
  {
    labels: {
      en: "ReLU",
      ta: "ReLU",
      hi: "ReLU",
    },
    forms: {
      en: ["relu"],
      ta: ["relu"],
      hi: ["relu"],
    },
  },
  {
    labels: {
      en: "Transformer",
      ta: "டிரான்ஸ்ஃபார்மர்",
      hi: "ट्रांसफॉर्मर",
    },
    forms: {
      en: ["transformer", "transformer models"],
      ta: ["டிரான்ஸ்ஃபார்மர்", "டிரான்ஸ்ஃபார்மர் மாதிரிகள்"],
      hi: ["ट्रांसफॉर्मर", "ट्रांसफॉर्मर मॉडल"],
    },
  },
  {
    labels: {
      en: "Attention",
      ta: "அட்டென்ஷன்",
      hi: "अटेंशन",
    },
    forms: {
      en: ["attention"],
      ta: ["அட்டென்ஷன்"],
      hi: ["अटेंशन"],
    },
  },
];

const ENGLISH_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "by",
  "during",
  "how",
  "into",
  "it",
  "of",
  "on",
  "or",
  "the",
  "their",
  "they",
  "this",
  "to",
  "today",
  "use",
  "we",
  "will",
]);

const TAMIL_STOPWORDS = new Set([
  "இன்று",
  "அவை",
  "எப்படி",
  "என்பதையும்",
  "ஒன்று",
  "உள்ளீட்டின்",
  "மிக",
  "போது",
  "போன்ற",
  "செய்யும்",
]);

const HINDI_STOPWORDS = new Set([
  "आज",
  "और",
  "इसे",
  "के",
  "को",
  "की",
  "करता",
  "करते",
  "दौरान",
  "पर",
  "यह",
  "में",
  "हम",
  "हैं",
]);

const PHRASE_TRANSLATIONS: Record<SupportedLanguageCode, Partial<Record<SupportedLanguageCode, Array<[string, string]>>>> = {
  en: {
    ta: [
      ["today we'll explore", "இன்று நாம் ஆராயப் போகிறோம்"],
      ["fundamentals", "அடிப்படைகள்"],
      ["learn from data", "தரவிலிருந்து கற்கின்றன"],
      ["consist of", "உருவாகின்றன"],
      ["perform simple computations", "எளிய கணக்கீடுகளை செய்கின்றன"],
      ["calculates gradients", "கிரேடியன்ட்களை கணக்கிடுகிறது"],
      ["chain rule of calculus", "கல்குலஸின் சங்கிலி விதி"],
      ["helps the model minimize", "மாதிரி குறைக்க உதவுகிறது"],
      ["during training", "பயிற்சியின் போது"],
      ["introduce non-linearity", "நேர்மையற்ற தன்மையை கொண்டு வருகின்றன"],
      ["use attention", "அட்டென்ஷனை பயன்படுத்துகின்றன"],
      ["most relevant parts", "மிக முக்கியமான பகுதிகள்"],
      ["input", "உள்ளீடு"],
    ],
    hi: [
      ["today we'll explore", "आज हम समझेंगे"],
      ["fundamentals", "मूल सिद्धांत"],
      ["learn from data", "डेटा से सीखते हैं"],
      ["consist of", "से बने होते हैं"],
      ["perform simple computations", "सरल गणनाएँ करते हैं"],
      ["calculates gradients", "ग्रेडिएंट की गणना करता है"],
      ["chain rule of calculus", "कलन का चेन रूल"],
      ["helps the model minimize", "मॉडल को कम करने में मदद करता है"],
      ["during training", "प्रशिक्षण के दौरान"],
      ["introduce non-linearity", "नॉन-लिनियरिटी लाते हैं"],
      ["use attention", "अटेंशन का उपयोग करते हैं"],
      ["most relevant parts", "सबसे महत्वपूर्ण हिस्से"],
      ["input", "इनपुट"],
    ],
  },
  ta: {
    en: [
      ["அடிப்படைகள்", "fundamentals"],
      ["தரவிலிருந்து கற்கின்றன", "learn from data"],
      ["உருவாகின்றன", "consist of"],
      ["எளிய கணக்கீடுகளை", "simple computations"],
      ["கிரேடியன்ட்களை கணக்கிடுகிறது", "calculates gradients"],
      ["சங்கிலி விதி", "chain rule"],
      ["பயிற்சியின் போது", "during training"],
      ["நேர்மையற்ற தன்மை", "non-linearity"],
      ["அட்டென்ஷன்", "attention"],
      ["உள்ளீடு", "input"],
    ],
    hi: [
      ["அடிப்படைகள்", "मूल सिद्धांत"],
      ["தரவு", "डेटा"],
      ["அடுக்குகள்", "परतें"],
      ["கணக்கீடுகள்", "गणनाएँ"],
      ["கிரேடியன்ட் டிசென்ட்", "ग्रेडिएंट डिसेंट"],
      ["லாஸ் செயல்பாடு", "लॉस फ़ंक्शन"],
      ["அட்டென்ஷன்", "अटेंशन"],
    ],
  },
  hi: {
    en: [
      ["मूल सिद्धांत", "fundamentals"],
      ["डेटा से सीखते हैं", "learn from data"],
      ["से बने होते हैं", "consist of"],
      ["सरल गणनाएँ", "simple computations"],
      ["ग्रेडिएंट की गणना", "calculates gradients"],
      ["चेन रूल", "chain rule"],
      ["प्रशिक्षण के दौरान", "during training"],
      ["नॉन-लिनियरिटी", "non-linearity"],
      ["अटेंशन", "attention"],
      ["इनपुट", "input"],
    ],
    ta: [
      ["मूल सिद्धांत", "அடிப்படைகள்"],
      ["डेटा", "தரவு"],
      ["परतें", "அடுக்குகள்"],
      ["गणनाएँ", "கணக்கீடுகள்"],
      ["ग्रेडिएंट डिसेंट", "கிரேடியன்ட் டிசென்ட்"],
      ["लॉस फ़ंक्शन", "லாஸ் செயல்பாடு"],
      ["अटेंशन", "அட்டென்ஷன்"],
    ],
  },
};

const GENERAL_PHRASE_TRANSLATIONS: Record<
  SupportedLanguageCode,
  Partial<Record<SupportedLanguageCode, Array<[string, string]>>>
> = {
  en: {
    ta: [
      ["today we are going to learn about", "இன்று நாம் இதைப் பற்றி கற்கப் போகிறோம்"],
      ["we are going to learn about", "நாம் இதைப் பற்றி கற்கப் போகிறோம்"],
      ["today we will learn about", "இன்று நாம் இதைப் பற்றி கற்போம்"],
      ["we will learn about", "நாம் இதைப் பற்றி கற்போம்"],
      ["today we are going to learn", "இன்று நாம் கற்கப் போகிறோம்"],
      ["we are going to learn", "நாம் கற்கப் போகிறோம்"],
      ["today we will learn", "இன்று நாம் கற்போம்"],
      ["we will learn", "நாம் கற்போம்"],
      ["let us begin with", "இதனுடன் தொடங்கலாம்"],
      ["let's begin with", "இதனுடன் தொடங்கலாம்"],
      ["this lecture is about", "இந்த விரிவுரை பற்றியது"],
      ["in this lecture", "இந்த விரிவுரையில்"],
    ],
    hi: [
      ["today we are going to learn about", "आज हम इसके बारे में सीखने वाले हैं"],
      ["we are going to learn about", "हम इसके बारे में सीखने वाले हैं"],
      ["today we will learn about", "आज हम इसके बारे में सीखेंगे"],
      ["we will learn about", "हम इसके बारे में सीखेंगे"],
      ["today we are going to learn", "आज हम सीखने वाले हैं"],
      ["we are going to learn", "हम सीखने वाले हैं"],
      ["today we will learn", "आज हम सीखेंगे"],
      ["we will learn", "हम सीखेंगे"],
      ["let us begin with", "आइए इससे शुरू करें"],
      ["let's begin with", "आइए इससे शुरू करें"],
      ["this lecture is about", "यह व्याख्यान इस बारे में है"],
      ["in this lecture", "इस व्याख्यान में"],
    ],
  },
};

const WORD_TRANSLATIONS: Record<
  SupportedLanguageCode,
  Partial<Record<SupportedLanguageCode, Record<string, string>>>
> = {
  en: {
    ta: {
      about: "பற்றி",
      algorithm: "அல்கோரிதம்",
      algorithms: "அல்கோரிதங்கள்",
      attention: "அட்டென்ஷன்",
      beach: "கடற்கரை",
      basic: "அடிப்படை",
      basics: "அடிப்படைகள்",
      concept: "கருத்து",
      concepts: "கருத்துகள்",
      data: "தரவு",
      function: "செயல்பாடு",
      functions: "செயல்பாடுகள்",
      gradient: "கிரேடியன்ட்",
      gradients: "கிரேடியன்ட்கள்",
      input: "உள்ளீடு",
      introduction: "அறிமுகம்",
      layer: "அடுக்கு",
      layers: "அடுக்குகள்",
      learn: "கற்க",
      learning: "கற்றல்",
      lecture: "விரிவுரை",
      loss: "லாஸ்",
      model: "மாதிரி",
      models: "மாதிரிகள்",
      network: "வலை",
      networks: "வலைகள்",
      neural: "நரம்பியல்",
      node: "நோடு",
      nodes: "நோடுகள்",
      output: "வெளியீடு",
      problem: "சிக்கல்",
      problems: "சிக்கல்கள்",
      seashore: "கடற்கரை",
      seashell: "கடல் சிப்பு",
      seashells: "கடல் சிப்பிகள்",
      sells: "விற்கிறாள்",
      sell: "விற்க",
      she: "அவள்",
      shore: "கரை",
      system: "அமைப்பு",
      systems: "அமைப்புகள்",
      topic: "தலைப்பு",
      topics: "தலைப்புகள்",
      training: "பயிற்சி",
      transformer: "டிரான்ஸ்ஃபார்மர்",
    },
    hi: {
      about: "के बारे में",
      algorithm: "एल्गोरिदम",
      algorithms: "एल्गोरिदम",
      attention: "अटेंशन",
      beach: "समुद्र तट",
      basic: "मूल",
      basics: "मूल बातें",
      concept: "अवधारणा",
      concepts: "अवधारणाएँ",
      data: "डेटा",
      function: "फ़ंक्शन",
      functions: "फ़ंक्शन",
      gradient: "ग्रेडिएंट",
      gradients: "ग्रेडिएंट",
      input: "इनपुट",
      introduction: "परिचय",
      layer: "परत",
      layers: "परतें",
      learn: "सीखना",
      learning: "सीखना",
      lecture: "व्याख्यान",
      loss: "लॉस",
      model: "मॉडल",
      models: "मॉडल",
      network: "नेटवर्क",
      networks: "नेटवर्क",
      neural: "न्यूरल",
      node: "नोड",
      nodes: "नोड",
      output: "आउटपुट",
      problem: "समस्या",
      problems: "समस्याएँ",
      seashore: "समुद्र तट",
      seashell: "समुद्री सीप",
      seashells: "समुद्री सीपियाँ",
      sells: "बेचती है",
      sell: "बेचना",
      she: "वह",
      shore: "किनारा",
      system: "सिस्टम",
      systems: "सिस्टम",
      topic: "विषय",
      topics: "विषय",
      training: "प्रशिक्षण",
      transformer: "ट्रांसफॉर्मर",
    },
  },
};

const EXTRA_GENERAL_PHRASE_TRANSLATIONS: Record<
  SupportedLanguageCode,
  Partial<Record<SupportedLanguageCode, Array<[string, string]>>>
> = {
  en: {
    ta: [
      ["natural language processing", "இயற்கை மொழி செயலாக்கம்"],
      ["artificial intelligence", "செயற்கை நுண்ணறிவு"],
      ["computer science", "கணினி அறிவியல்"],
      ["machine learning", "இயந்திர கற்றல்"],
      ["human language", "மனித மொழி"],
      ["data preprocessing", "தரவு முன்செயலாக்கம்"],
      ["text pre-processing", "உரை முன்செயலாக்கம்"],
      ["algorithm development", "அல்கோரிதம் உருவாக்கம்"],
      ["structured text", "கட்டமைக்கப்பட்ட உரை"],
      ["unstructured text", "கட்டமைப்பாடாத உரை"],
      ["specific applications", "குறிப்பிட்ட பயன்பாடுகள்"],
      ["text analysis", "உரை பகுப்பாய்வு"],
      ["word tokenisation", "சொல் டோகனைசேஷன்"],
      ["sentence tokenisation", "வாக்கிய டோகனைசேஷன்"],
      ["tokenization", "டோகனைசேஷன்"],
      ["in this lecture", "இந்த விரிவுரையில்"],
      ["in today's lecture", "இன்றைய விரிவுரையில்"],
      ["first we will", "முதலில் நாம்"],
      ["next we will", "அடுத்து நாம்"],
      ["finally we will", "இறுதியாக நாம்"],
      ["let us understand", "புரிந்துகொள்வோம்"],
      ["let us discuss", "விவாதிப்போம்"],
      ["we will discuss", "நாம் விவாதிப்போம்"],
      ["we will understand", "நாம் புரிந்துகொள்வோம்"],
      ["we will see", "நாம் பார்க்கலாம்"],
      ["important topic", "முக்கியமான தலைப்பு"],
      ["important concept", "முக்கியமான கருத்து"],
    ],
    hi: [
      ["natural language processing", "प्राकृतिक भाषा प्रसंस्करण"],
      ["artificial intelligence", "कृत्रिम बुद्धिमत्ता"],
      ["computer science", "कंप्यूटर विज्ञान"],
      ["machine learning", "मशीन लर्निंग"],
      ["human language", "मानव भाषा"],
      ["data preprocessing", "डेटा पूर्व-प्रसंस्करण"],
      ["text pre-processing", "पाठ पूर्व-प्रसंस्करण"],
      ["algorithm development", "एल्गोरिदम विकास"],
      ["structured text", "संरचित पाठ"],
      ["unstructured text", "असंरचित पाठ"],
      ["specific applications", "विशिष्ट अनुप्रयोग"],
      ["text analysis", "पाठ विश्लेषण"],
      ["word tokenisation", "शब्द टोकेनाइज़ेशन"],
      ["sentence tokenisation", "वाक्य टोकेनाइज़ेशन"],
      ["tokenization", "टोकेनाइज़ेशन"],
      ["in this lecture", "इस व्याख्यान में"],
      ["in today's lecture", "आज के व्याख्यान में"],
      ["first we will", "सबसे पहले हम"],
      ["next we will", "इसके बाद हम"],
      ["finally we will", "अंत में हम"],
      ["let us understand", "आइए समझते हैं"],
      ["let us discuss", "आइए चर्चा करते हैं"],
      ["we will discuss", "हम चर्चा करेंगे"],
      ["we will understand", "हम समझेंगे"],
      ["we will see", "हम देखेंगे"],
      ["important topic", "महत्वपूर्ण विषय"],
      ["important concept", "महत्वपूर्ण अवधारणा"],
    ],
  },
  ta: {
    en: [
      ["இன்று நாம்", "today we"],
      ["நாம்", "we"],
      ["பற்றி", "about"],
      ["கற்கப் போகிறோம்", "are going to learn"],
      ["கற்போம்", "will learn"],
      ["பார்க்கலாம்", "let us see"],
      ["புரிந்துகொள்வோம்", "let us understand"],
      ["விவாதிப்போம்", "let us discuss"],
      ["இந்த விரிவுரையில்", "in this lecture"],
      ["இன்றைய விரிவுரையில்", "in today's lecture"],
      ["முதலில்", "first"],
      ["அடுத்து", "next"],
      ["இறுதியாக", "finally"],
    ],
    hi: [
      ["இன்று நாம்", "आज हम"],
      ["நாம்", "हम"],
      ["பற்றி", "के बारे में"],
      ["கற்கப் போகிறோம்", "सीखने वाले हैं"],
      ["கற்போம்", "सीखेंगे"],
      ["பார்க்கலாம்", "देखेंगे"],
      ["புரிந்துகொள்வோம்", "समझेंगे"],
      ["விவாதிப்போம்", "चर्चा करेंगे"],
      ["இந்த விரிவுரையில்", "इस व्याख्यान में"],
      ["முதலில்", "सबसे पहले"],
      ["அடுத்து", "इसके बाद"],
      ["இறுதியாக", "अंत में"],
    ],
  },
  hi: {
    en: [
      ["आज हम", "today we"],
      ["हम", "we"],
      ["के बारे में", "about"],
      ["सीखने वाले हैं", "are going to learn"],
      ["सीखेंगे", "will learn"],
      ["देखेंगे", "will see"],
      ["समझेंगे", "will understand"],
      ["चर्चा करेंगे", "will discuss"],
      ["इस व्याख्यान में", "in this lecture"],
      ["आज के व्याख्यान में", "in today's lecture"],
      ["सबसे पहले", "first"],
      ["इसके बाद", "next"],
      ["अंत में", "finally"],
    ],
    ta: [
      ["आज हम", "இன்று நாம்"],
      ["हम", "நாம்"],
      ["के बारे में", "பற்றி"],
      ["सीखने वाले हैं", "கற்கப் போகிறோம்"],
      ["सीखेंगे", "கற்போம்"],
      ["देखेंगे", "பார்க்கலாம்"],
      ["समझेंगे", "புரிந்துகொள்வோம்"],
      ["चर्चा करेंगे", "விவாதிப்போம்"],
      ["इस व्याख्यान में", "இந்த விரிவுரையில்"],
      ["आज के व्याख्यान में", "இன்றைய விரிவுரையில்"],
      ["सबसे पहले", "முதலில்"],
      ["इसके बाद", "அடுத்து"],
      ["अंत में", "இறுதியாக"],
    ],
  },
};

const EXTRA_WORD_TRANSLATIONS: Record<
  SupportedLanguageCode,
  Partial<Record<SupportedLanguageCode, Record<string, string>>>
> = {
  en: {
    ta: {
      analysis: "பகுப்பாய்வு",
      applications: "பயன்பாடுகள்",
      artificial: "செயற்கை",
      computer: "கணினி",
      chapter: "அத்தியாயம்",
      class: "வகுப்பு",
      discuss: "விவாதிக்க",
      efficiency: "செயல்திறன்",
      discussing: "விவாதித்தல்",
      explain: "விளக்க",
      explains: "விளக்குகிறது",
      first: "முதலில்",
      human: "மனித",
      here: "இங்கே",
      important: "முக்கியமான",
      increase: "அதிகரிக்க",
      intelligence: "நுண்ணறிவு",
      interpret: "விளக்கிக்கொள்ள",
      intersection: "சந்திப்பு",
      language: "மொழி",
      linguistics: "மொழியியல்",
      manipulate: "கையாள",
      natural: "இயற்கை",
      next: "அடுத்து",
      noise: "சத்தம்",
      parts: "பகுதிகள்",
      final: "இறுதி",
      finally: "இறுதியாக",
      phrases: "சொற்றொடர்கள்",
      preprocessing: "முன்செயலாக்கம்",
      process: "செயலாக்க",
      processes: "செயல்முறைகள்",
      processing: "செயலாக்கம்",
      reduce: "குறைக்க",
      resources: "வளங்கள்",
      science: "அறிவியல்",
      specific: "குறிப்பிட்ட",
      structured: "கட்டமைக்கப்பட்ட",
      techniques: "நுட்பங்கள்",
      text: "உரை",
      tokenization: "டோகனைசேஷன்",
      tokens: "டோகன்கள்",
      transform: "மாற்ற",
      transforming: "மாற்றும்",
      unstructured: "கட்டமைப்பாடாத",
      understand: "புரிந்துகொள்ள",
      understanding: "புரிதல்",
      very: "மிகவும்",
      word: "சொல்",
    },
    hi: {
      analysis: "विश्लेषण",
      applications: "अनुप्रयोग",
      artificial: "कृत्रिम",
      computer: "कंप्यूटर",
      chapter: "अध्याय",
      class: "कक्षा",
      discuss: "चर्चा करना",
      efficiency: "दक्षता",
      discussing: "चर्चा",
      explain: "समझाना",
      explains: "समझाता है",
      first: "सबसे पहले",
      human: "मानव",
      here: "यहाँ",
      important: "महत्वपूर्ण",
      increase: "बढ़ाना",
      intelligence: "बुद्धिमत्ता",
      interpret: "व्याख्या करना",
      intersection: "मिलन बिंदु",
      language: "भाषा",
      linguistics: "भाषाविज्ञान",
      manipulate: "संचालित करना",
      natural: "प्राकृतिक",
      next: "अगला",
      noise: "शोर",
      parts: "भाग",
      final: "अंतिम",
      finally: "अंत में",
      phrases: "वाक्यांश",
      preprocessing: "पूर्व-प्रसंस्करण",
      process: "प्रक्रिया",
      processes: "प्रक्रियाएँ",
      processing: "प्रसंस्करण",
      reduce: "कम करना",
      resources: "संसाधन",
      science: "विज्ञान",
      specific: "विशिष्ट",
      structured: "संरचित",
      techniques: "तकनीकें",
      text: "पाठ",
      tokenization: "टोकेनाइज़ेशन",
      tokens: "टोकेन",
      transform: "रूपांतरित करना",
      transforming: "रूपांतरित करना",
      unstructured: "असंरचित",
      understand: "समझना",
      understanding: "समझ",
      very: "बहुत",
      word: "शब्द",
    },
  },
  ta: {
    en: {
      இன்று: "today",
      நாம்: "we",
      இது: "this",
      இந்த: "this",
      பற்றி: "about",
      கற்க: "learn",
      கற்போம்: "will learn",
      கற்கப்: "learn",
      போகிறோம்: "are going",
      விரிவுரை: "lecture",
      தலைப்பு: "topic",
      முக்கியமான: "important",
      கருத்து: "concept",
      தரவு: "data",
      மாதிரி: "model",
      மாதிரிகள்: "models",
      அடுத்தது: "next",
      முதலில்: "first",
      இறுதியாக: "finally",
    },
    hi: {
      இன்று: "आज",
      நாம்: "हम",
      இது: "यह",
      இந்த: "इस",
      பற்றி: "के बारे में",
      கற்க: "सीखना",
      கற்போம்: "सीखेंगे",
      கற்கப்: "सीख",
      போகிறோம்: "वाले हैं",
      விரிவுரை: "व्याख्यान",
      தலைப்பு: "विषय",
      முக்கியமான: "महत्वपूर्ण",
      கருத்து: "अवधारणा",
      தரவு: "डेटा",
      மாதிரி: "मॉडल",
      மாதிரிகள்: "मॉडल",
      முதலில்: "सबसे पहले",
      இறுதியாக: "अंत में",
    },
  },
  hi: {
    en: {
      आज: "today",
      हम: "we",
      यह: "this",
      इस: "this",
      बारे: "about",
      सीखेंगे: "will learn",
      सीखने: "learn",
      वाले: "going to",
      हैं: "are",
      व्याख्यान: "lecture",
      विषय: "topic",
      महत्वपूर्ण: "important",
      अवधारणा: "concept",
      डेटा: "data",
      मॉडल: "model",
      पहले: "first",
      अंत: "finally",
    },
    ta: {
      आज: "இன்று",
      हम: "நாம்",
      यह: "இது",
      इस: "இந்த",
      बारे: "பற்றி",
      सीखेंगे: "கற்போம்",
      सीखने: "கற்க",
      वाले: "போகிறோம்",
      हैं: "இருக்கிறோம்",
      व्याख्यान: "விரிவுரை",
      विषय: "தலைப்பு",
      महत्वपूर्ण: "முக்கியமான",
      अवधारणा: "கருத்து",
      डेटा: "தரவு",
      मॉडल: "மாதிரி",
      पहले: "முதலில்",
      अंत: "இறுதியாக",
    },
  },
};

const TRANSLATION_CLEANUPS: Record<SupportedLanguageCode, Array<[string, string]>> = {
  en: [
    ["about about", "about"],
    ["we we", "we"],
    ["today today", "today"],
    ["the the", "the"],
  ],
  ta: [
    ["பற்றி பற்றி", "பற்றி"],
    ["நாம் நாம்", "நாம்"],
    ["இன்று இன்று", "இன்று"],
    ["முக்கியமான முக்கியமான", "முக்கியமான"],
  ],
  hi: [
    ["के बारे में के बारे में", "के बारे में"],
    ["हम हम", "हम"],
    ["आज आज", "आज"],
    ["महत्वपूर्ण महत्वपूर्ण", "महत्वपूर्ण"],
  ],
};

export function createEmptyLectureBuffer(): LectureProcessingBuffer {
  return {
    finalizedSegments: [],
    activeSegment: "",
  };
}

export function createEmptyLectureOutput(): LectureEngineOutput {
  return {
    detected_language: "",
    clean_transcript: "",
    translated_text: "",
    keywords: [],
    short_summary: "",
    detailed_summary: [],
  };
}

export function getDemoStream(language: SupportedLanguageCode) {
  return DEMO_SENTENCES.flatMap((item) =>
    item.chunks[language].map((chunk, index, items) => ({
      text: chunk,
      isFinal: index === items.length - 1,
    })),
  );
}

export function detectLanguage(text: string): SupportedLanguageCode {
  const tamilCount = countMatches(text, /[\u0B80-\u0BFF]/g);
  const hindiCount = countMatches(text, /[\u0900-\u097F]/g);
  const englishCount = countMatches(text, /[A-Za-z]/g);

  if (tamilCount >= hindiCount && tamilCount > englishCount) {
    return "ta";
  }

  if (hindiCount > tamilCount && hindiCount > englishCount) {
    return "hi";
  }

  return "en";
}

export function mergeTranscriptChunk(existing: string, incoming: string) {
  const previous = normalizeWhitespace(existing);
  const next = normalizeWhitespace(incoming);

  if (!previous) {
    return next;
  }

  if (!next) {
    return previous;
  }

  const previousWords = previous.split(" ");
  const nextWords = next.split(" ");
  const overlapLimit = Math.min(previousWords.length, nextWords.length, 8);

  for (let size = overlapLimit; size > 0; size -= 1) {
    const previousTail = previousWords.slice(-size).join(" ").toLowerCase();
    const nextHead = nextWords.slice(0, size).join(" ").toLowerCase();

    if (previousTail === nextHead) {
      return normalizeWhitespace([...previousWords, ...nextWords.slice(size)].join(" "));
    }
  }

  const needsSpace =
    !/[(\[{]$/.test(previous) &&
    !/^[,.;!?)}\]]/.test(next);

  return normalizeWhitespace(previous + (needsSpace ? " " : "") + next);
}

export function cleanTranscriptText(text: string, finalize = false) {
  const normalized = normalizeWhitespace(text)
    .replace(/\s+([,.;!?])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .replace(/\s+([)\]}])/g, "$1")
    .replace(/\b(i)\b/g, "I");

  if (!normalized) {
    return "";
  }

  const capitalized = /^[a-z]/.test(normalized)
    ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
    : normalized;

  if (!finalize) {
    return capitalized;
  }

  return /[.?!।]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}

export function buildLectureOutput(
  buffer: LectureProcessingBuffer,
  targetLanguage: SupportedLanguageCode,
): LectureEngineOutput {
  const combinedText = joinSegments(buffer.finalizedSegments, buffer.activeSegment);

  if (!combinedText) {
    return createEmptyLectureOutput();
  }

  const sourceLanguage = detectLanguage(combinedText);
  const cleanTranscript = combinedText;
  const translatedText = translateText(cleanTranscript, sourceLanguage, targetLanguage);
  const sourceKeywords = extractKeywords(cleanTranscript, sourceLanguage, sourceLanguage);
  const keywords = extractKeywords(cleanTranscript, sourceLanguage, targetLanguage);
  const detailedSourcePoints = buildDetailedPoints(
    buffer,
    cleanTranscript,
    sourceLanguage,
    sourceKeywords,
  );
  const shortSourceSummary = buildShortSummary(
    cleanTranscript,
    detailedSourcePoints,
    sourceLanguage,
    sourceKeywords,
  );

  return {
    detected_language: LANGUAGE_LABELS[sourceLanguage],
    clean_transcript: cleanTranscript,
    translated_text: translatedText,
    keywords,
    short_summary: shortSourceSummary
      ? translateText(shortSourceSummary, sourceLanguage, targetLanguage)
      : "",
    detailed_summary: detailedSourcePoints.map((point) =>
      translateText(point, sourceLanguage, targetLanguage),
    ),
  };
}

export function translateText(
  text: string,
  sourceLanguage: SupportedLanguageCode,
  targetLanguage: SupportedLanguageCode,
) {
  const cleaned = normalizeWhitespace(text);

  if (!cleaned) {
    return "";
  }

  if (sourceLanguage === targetLanguage) {
    return cleaned;
  }

  const exactTranslation = translateExactSentence(cleaned, sourceLanguage, targetLanguage);

  if (exactTranslation) {
    return exactTranslation;
  }

  const sentenceTranslations = splitIntoSentences(cleaned).map((sentence) =>
    translateSentence(sentence, sourceLanguage, targetLanguage),
  );

  if (sentenceTranslations.length > 0) {
    return sentenceTranslations.join(" ");
  }

  return translateSentence(cleaned, sourceLanguage, targetLanguage);
}

export function extractKeywords(
  text: string,
  sourceLanguage: SupportedLanguageCode,
  targetLanguage: SupportedLanguageCode,
) {
  const normalized = normalizeWhitespace(text);
  const detectedConcepts = CONCEPTS
    .filter((concept) =>
      concept.forms[sourceLanguage].some((form) => containsCaseInsensitive(normalized, form)),
    )
    .map((concept) => concept.labels[targetLanguage]);

  const fallbackWords = extractFrequentTokens(normalized, sourceLanguage)
    .filter((word) => !detectedConcepts.some((keyword) => keyword.toLowerCase() === word.toLowerCase()))
    .slice(0, 8 - detectedConcepts.length);

  return [...detectedConcepts, ...fallbackWords].slice(0, 8);
}

function buildDetailedPoints(
  buffer: LectureProcessingBuffer,
  cleanTranscript: string,
  sourceLanguage: SupportedLanguageCode,
  sourceKeywords: string[],
) {
  if (sourceLanguage === "en") {
    const synthesizedTakeaways = buildEnglishTakeaways(cleanTranscript, sourceKeywords);

    if (synthesizedTakeaways.length > 0) {
      return synthesizedTakeaways.slice(0, 5);
    }
  }

  const candidates = [...buffer.finalizedSegments];

  if (buffer.activeSegment && countWords(buffer.activeSegment) >= 8) {
    candidates.push(buffer.activeSegment);
  }

  if (candidates.length <= 3) {
    return candidates.slice(0, 5);
  }

  const keywordSet = new Set(sourceKeywords.map((keyword) => normalizeForLookup(keyword)));
  const scored = candidates.map((sentence, index) => {
    const normalizedSentence = normalizeForLookup(sentence);
    const tokenCount = countWords(sentence);
    const keywordHits = sourceKeywords.reduce((count, keyword) => {
      if (!keyword) {
        return count;
      }

      return count + (containsCaseInsensitive(normalizedSentence, normalizeForLookup(keyword)) ? 1 : 0);
    }, 0);
    const conceptHits = CONCEPTS.reduce((count, concept) => {
      return (
        count +
        concept.forms[sourceLanguage].reduce(
          (formCount, form) =>
            formCount + (containsCaseInsensitive(normalizedSentence, normalizeForLookup(form)) ? 1 : 0),
          0,
        )
      );
    }, 0);
    const repeatedTokenHits = extractSentenceTokenHits(sentence, keywordSet);
    const positionScore = index === 0 ? 1.25 : index < 3 ? 1 : index === candidates.length - 1 ? 0.9 : 0.75;
    const lengthScore = tokenCount >= 8 && tokenCount <= 26 ? 1 : tokenCount > 26 ? 0.8 : 0.55;

    return {
      index,
      sentence,
      score:
        keywordHits * 2.1 +
        conceptHits * 1.8 +
        repeatedTokenHits * 1.4 +
        positionScore +
        lengthScore,
    };
  });

  const selected: Array<{ index: number; sentence: string; score: number }> = [];

  for (const candidate of [...scored].sort((left, right) => right.score - left.score || left.index - right.index)) {
    const isTooSimilar = selected.some((picked) => sentenceSimilarity(picked.sentence, candidate.sentence) > 0.7);

    if (isTooSimilar) {
      continue;
    }

    selected.push(candidate);

    if (selected.length >= 5) {
      break;
    }
  }

  return selected
    .sort((left, right) => left.index - right.index)
    .map((item) => cleanSummarySentence(item.sentence))
    .slice(0, 5);
}

function buildShortSummary(
  cleanTranscript: string,
  points: string[],
  sourceLanguage: SupportedLanguageCode,
  sourceKeywords: string[],
) {
  if (points.length === 0) {
    return "";
  }

  if (sourceLanguage === "en") {
    const overview = buildEnglishOverview(cleanTranscript, points, sourceKeywords);

    if (overview) {
      return overview;
    }
  }

  if (points.length === 1) {
    return points[0];
  }

  return `${stripTerminalPunctuation(points[0])}. ${stripTerminalPunctuation(points[1])}.`;
}

function buildEnglishOverview(
  cleanTranscript: string,
  points: string[],
  sourceKeywords: string[],
) {
  const leadKeywords = sourceKeywords.slice(0, 3);
  const topicList = leadKeywords.length > 0 ? formatSummaryTopicList(leadKeywords) : "the lecture topic";
  const hasApplications = points.some((point) => /\b(applications include|used across|supports|helps)\b/i.test(point));
  const hasMethods = points.some((point) => /\buses\b/i.test(point));
  const firstSentence = splitIntoSentences(cleanTranscript)[0];
  const subject = extractEnglishSubject(firstSentence) || topicList;

  if (hasMethods && hasApplications) {
    return `This lecture summarizes ${subject}, the core methods behind it, and how it is applied in practice.`;
  }

  if (hasApplications) {
    return `This lecture explains ${subject} and highlights its main applications and impact.`;
  }

  if (hasMethods) {
    return `This lecture explains ${subject} and highlights the main methods used to understand it.`;
  }

  return `This lecture explains ${topicList} and the main idea behind the topic.`;
}

function buildEnglishTakeaways(text: string, sourceKeywords: string[]) {
  const sentences = splitIntoSentences(text)
    .map((sentence) => stripTerminalPunctuation(cleanSummarySentence(sentence)))
    .filter(Boolean);
  const takeaways: string[] = [];
  const primarySentence = sentences[0] ?? "";

  pushUniqueSummaryPoint(
    takeaways,
    summarizeEnglishDefinitionSentence(primarySentence, sourceKeywords),
  );
  pushUniqueSummaryPoint(takeaways, summarizeEnglishMethods(text));
  pushUniqueSummaryPoint(takeaways, summarizeEnglishApplications(text));
  pushUniqueSummaryPoint(takeaways, summarizeEnglishIndustries(text));

  for (const sentence of sentences) {
    pushUniqueSummaryPoint(
      takeaways,
      compressEnglishSentence(sentence),
    );

    if (takeaways.length >= 5) {
      break;
    }
  }

  return takeaways.slice(0, 5);
}

function summarizeEnglishDefinitionSentence(sentence: string, sourceKeywords: string[]) {
  if (!sentence) {
    return "";
  }

  let compressed = sentence
    .replace(/\binside patterns\b/gi, "patterns")
    .replace(/\blogical data\b/gi, "raw data")
    .replace(/\bextract\b/gi, "extract")
    .replace(/\bprediction\b/gi, "predictions")
    .replace(/\bthat extract\b/gi, "that extracts")
    .replace(/\busing .+$/i, "")
    .replace(/\bfor .+$/i, "")
    .replace(/\bacross .+$/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (compressed.length === 0) {
    return "";
  }

  if (!/\bis\b/i.test(compressed) && sourceKeywords.length > 0) {
    compressed = `${sourceKeywords[0]} focuses on ${compressed.toLowerCase()}`;
  }

  return ensureSentence(compressed);
}

function summarizeEnglishMethods(text: string) {
  const usingMatch = text.match(
    /\busing\s+([^.!?]+?)(?=(?:\s+for\b|\s+to\b|\s+across\b|[.?!]|$))/i,
  );

  if (!usingMatch) {
    return "";
  }

  const methods = normalizeEnglishList(usingMatch[1]);

  return methods ? `It uses ${methods}.` : "";
}

function summarizeEnglishApplications(text: string) {
  const purposeMatch = text.match(
    /\bfor\s+([^.!?]+?)(?=(?:\s+across\b|[.?!]|$))/i,
  );

  if (!purposeMatch) {
    return "";
  }

  const applications = normalizeEnglishList(purposeMatch[1])
    .replace(/\binforming business decision\b/gi, "informing business decisions")
    .replace(/\boptimizing operation\b/gi, "optimizing operations")
    .replace(/\bpersonalizing user experience\b/gi, "personalizing user experiences");

  if (!applications) {
    return "";
  }

  return `Key applications include ${applications}.`;
}

function summarizeEnglishIndustries(text: string) {
  const industriesMatch = text.match(
    /\bacross\s+industr(?:y|ies)\s+(?:like|such as|including)\s+([^.!?]+)/i,
  );

  if (!industriesMatch) {
    return "";
  }

  const industries = normalizeEnglishList(industriesMatch[1]);

  return industries ? `Common industries include ${industries}.` : "";
}

function compressEnglishSentence(sentence: string) {
  if (!sentence) {
    return "";
  }

  const compressed = sentence
    .replace(/\bwhich\s+/gi, "")
    .replace(/\bthat\s+/gi, "that ")
    .replace(/\s+/g, " ")
    .trim();

  if (countWords(compressed) < 7) {
    return "";
  }

  if (countWords(compressed) > 22) {
    const trimmed = compressed
      .replace(/\busing .+$/i, "")
      .replace(/\bfor .+$/i, "")
      .replace(/\bacross .+$/i, "")
      .trim();

    return ensureSentence(trimmed);
  }

  return ensureSentence(compressed);
}

function extractEnglishSubject(sentence: string) {
  const cleaned = stripTerminalPunctuation(cleanSummarySentence(sentence));
  const subjectMatch = cleaned.match(/^(.+?)\s+is\b/i);

  if (subjectMatch) {
    return normalizeWhitespace(subjectMatch[1]);
  }

  return "";
}

function normalizeEnglishList(text: string) {
  return normalizeWhitespace(text)
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+and\s+/gi, ", and ")
    .replace(/\bmachine learning\b/gi, "machine learning")
    .replace(/\s+/g, " ")
    .trim();
}

function pushUniqueSummaryPoint(points: string[], candidate: string) {
  const normalizedCandidate = stripTerminalPunctuation(cleanSummarySentence(candidate));

  if (!normalizedCandidate || countWords(normalizedCandidate) < 5) {
    return;
  }

  const isDuplicate = points.some(
    (point) => sentenceSimilarity(point, normalizedCandidate) > 0.72,
  );

  if (isDuplicate) {
    return;
  }

  points.push(ensureSentence(normalizedCandidate));
}

function ensureSentence(text: string) {
  const normalized = normalizeWhitespace(text);

  if (!normalized) {
    return "";
  }

  return /[.?!à¥¤]$/.test(normalized) ? normalized : `${normalized}.`;
}

function extractFrequentTokens(text: string, language: SupportedLanguageCode) {
  const tokens = text.match(/[\p{L}\p{N}]+/gu) ?? [];
  const counts = new Map<string, number>();
  const stopwords = getStopwords(language);

  for (const rawToken of tokens) {
    const token = rawToken.trim();

    if (!token || token.length < 3 || stopwords.has(token.toLowerCase()) || stopwords.has(token)) {
      continue;
    }

    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([token]) => token);
}

function extractSentenceTokenHits(sentence: string, keywords: Set<string>) {
  const tokens = sentence
    .match(/[\p{L}\p{N}]+/gu)
    ?.map((token) => normalizeForLookup(token))
    .filter(Boolean) ?? [];

  return tokens.reduce((count, token) => count + (keywords.has(token) ? 1 : 0), 0);
}

function sentenceSimilarity(leftSentence: string, rightSentence: string) {
  const left = new Set(
    leftSentence.match(/[\p{L}\p{N}]+/gu)?.map((token) => normalizeForLookup(token)).filter(Boolean) ?? [],
  );
  const right = new Set(
    rightSentence.match(/[\p{L}\p{N}]+/gu)?.map((token) => normalizeForLookup(token)).filter(Boolean) ?? [],
  );

  if (left.size === 0 || right.size === 0) {
    return 0;
  }

  let overlap = 0;

  for (const token of left) {
    if (right.has(token)) {
      overlap += 1;
    }
  }

  return overlap / Math.min(left.size, right.size);
}

function cleanSummarySentence(sentence: string) {
  return normalizeWhitespace(sentence)
    .replace(/^(so|now|okay|well)\s+/i, "")
    .replace(/\b(uh|um)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatSummaryTopicList(topics: string[]) {
  if (topics.length === 0) {
    return "the key lecture topics";
  }

  if (topics.length === 1) {
    return topics[0];
  }

  if (topics.length === 2) {
    return `${topics[0]} and ${topics[1]}`;
  }

  return `${topics[0]}, ${topics[1]}, and ${topics[2]}`;
}

function translateExactSentence(
  text: string,
  sourceLanguage: SupportedLanguageCode,
  targetLanguage: SupportedLanguageCode,
) {
  const normalized = normalizeForLookup(text);

  for (const sentence of DEMO_SENTENCES) {
    if (normalizeForLookup(sentence.sentences[sourceLanguage]) === normalized) {
      return sentence.sentences[targetLanguage];
    }
  }

  const matchingParts = normalized
    .split(/[.?!।]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = DEMO_SENTENCES.find(
        (sentence) => normalizeForLookup(sentence.sentences[sourceLanguage]) === part,
      );

      return match?.sentences[targetLanguage];
    });

  if (matchingParts.length > 0 && matchingParts.every(Boolean)) {
    return matchingParts.join(" ");
  }

  return "";
}

function translateSentence(
  sentence: string,
  sourceLanguage: SupportedLanguageCode,
  targetLanguage: SupportedLanguageCode,
) {
  const cleanedSentence = normalizeWhitespace(sentence);

  if (!cleanedSentence) {
    return "";
  }

  const exactTranslation = translateExactSentence(cleanedSentence, sourceLanguage, targetLanguage);

  if (exactTranslation) {
    return exactTranslation;
  }

  const templateTranslation = translateTemplateSentence(
    cleanedSentence,
    sourceLanguage,
    targetLanguage,
  );

  if (templateTranslation) {
    return templateTranslation;
  }

  return translateFragment(cleanedSentence, sourceLanguage, targetLanguage);
}

function translateTemplateSentence(
  sentence: string,
  sourceLanguage: SupportedLanguageCode,
  targetLanguage: SupportedLanguageCode,
) {
  if (sourceLanguage !== "en") {
    return "";
  }

  const punctuation = extractTerminalPunctuationSafe(sentence);
  const normalized = normalizeForLookup(sentence);
  const learnAboutPattern =
    /^(today\s+)?we(?:'ll| will| are going to)\s+learn about(?:\s+(.+))?$/i;
  const learnPattern =
    /^(today\s+)?we(?:'ll| will| are going to)\s+learn(?:\s+(.+))?$/i;
  const lectureVerbPattern =
    /^(today\s+)?we(?:'ll| will| are going to)\s+(discuss|understand|study|cover|explore|see|look at)(?:\s+(.+))?$/i;
  const simpleSellingPattern =
    /^(she|he|they)\s+sells?\s+(.+?)\s+(?:in|on|at|by)\s+(.+)$/i;

  const aboutMatch = normalized.match(learnAboutPattern);

  if (aboutMatch) {
    const hasToday = Boolean(aboutMatch[1]);
    const rawTopic = aboutMatch[2]?.trim();
    const topic = rawTopic
      ? stripTerminalPunctuation(translateFragment(rawTopic, sourceLanguage, targetLanguage))
      : targetLanguage === "ta"
        ? "இதை"
        : "इस विषय";

    if (targetLanguage === "ta") {
      return `${hasToday ? "இன்று நாம்" : "நாம்"} ${topic} பற்றி கற்கப் போகிறோம்${punctuation}`;
    }

    if (targetLanguage === "hi") {
      return `${hasToday ? "आज हम" : "हम"} ${topic} के बारे में सीखने वाले हैं${punctuation}`;
    }
  }

  const learnMatch = normalized.match(learnPattern);

  if (learnMatch) {
    const hasToday = Boolean(learnMatch[1]);
    const rawTopic = learnMatch[2]?.trim();
    const topic = rawTopic
      ? ` ${stripTerminalPunctuation(translateFragment(rawTopic, sourceLanguage, targetLanguage))}`
      : "";

    if (targetLanguage === "ta") {
      return `${hasToday ? "இன்று நாம்" : "நாம்"}${topic} கற்கப் போகிறோம்${punctuation}`;
    }

    if (targetLanguage === "hi") {
      return `${hasToday ? "आज हम" : "हम"}${topic} सीखने वाले हैं${punctuation}`;
    }
  }

  const lectureVerbMatch = normalized.match(lectureVerbPattern);

  if (lectureVerbMatch) {
    const hasToday = Boolean(lectureVerbMatch[1]);
    const action = lectureVerbMatch[2].toLowerCase();
    const rawTopic = lectureVerbMatch[3]?.trim();
    const topic = rawTopic
      ? ` ${stripTerminalPunctuation(translateFragment(rawTopic, sourceLanguage, targetLanguage))}`
      : "";

    if (targetLanguage === "ta") {
      return `${hasToday ? "இன்று நாம்" : "நாம்"}${topic} ${getLectureVerbPhrase(action, targetLanguage)}${punctuation}`;
    }

    if (targetLanguage === "hi") {
      return `${hasToday ? "आज हम" : "हम"}${topic} ${getLectureVerbPhrase(action, targetLanguage)}${punctuation}`;
    }
  }

  const simpleSellingMatch = normalized.match(simpleSellingPattern);

  if (simpleSellingMatch) {
    const subject = simpleSellingMatch[1].toLowerCase();
    const objectText = stripTerminalPunctuation(
      translateFragment(simpleSellingMatch[2], sourceLanguage, targetLanguage),
    );
    const placeText = stripTerminalPunctuation(
      translateFragment(simpleSellingMatch[3], sourceLanguage, targetLanguage),
    );

    if (targetLanguage === "ta") {
      const subjectText = subject === "she" ? "அவள்" : subject === "he" ? "அவன்" : "அவர்கள்";
      const verbText = subject === "they" ? "விற்கிறார்கள்" : "விற்கிறான்";
      const resolvedVerb = subject === "she" ? "விற்கிறாள்" : verbText;
      return `${subjectText} ${placeText} ${objectText} ${resolvedVerb}${punctuation}`;
    }

    if (targetLanguage === "hi") {
      const subjectText = subject === "they" ? "वे" : "वह";
      const verbText = subject === "she" ? "बेचती है" : subject === "he" ? "बेचता है" : "बेचते हैं";
      return `${subjectText} ${placeText} में ${objectText} ${verbText}${punctuation}`;
    }
  }

  return "";
}

function translateFragment(
  text: string,
  sourceLanguage: SupportedLanguageCode,
  targetLanguage: SupportedLanguageCode,
) {
  let translated = normalizeWhitespace(text);

  for (const concept of CONCEPTS) {
    for (const form of concept.forms[sourceLanguage]) {
      translated = replaceCaseInsensitive(translated, form, concept.labels[targetLanguage]);
    }
  }

  for (const [from, to] of getPhraseTranslationRules(
    sourceLanguage,
    targetLanguage,
  ).sort((left, right) => right[0].length - left[0].length)) {
    translated = replaceCaseInsensitive(translated, from, to);
  }

  translated = translateWordTokens(translated, sourceLanguage, targetLanguage);

  return cleanupTranslationSpacingSafe(applyTranslationCleanups(translated, targetLanguage));
}

function translateWordTokens(
  text: string,
  sourceLanguage: SupportedLanguageCode,
  targetLanguage: SupportedLanguageCode,
) {
  const dictionary = getWordDictionary(sourceLanguage, targetLanguage);

  if (Object.keys(dictionary).length === 0) {
    return text;
  }

  return text.replace(/[\p{L}\p{N}']+/gu, (token) => {
    const translatedToken = dictionary[token.toLowerCase()];
    return translatedToken ?? token;
  });
}

function joinSegments(finalizedSegments: string[], activeSegment: string) {
  return [...finalizedSegments, activeSegment].filter(Boolean).join(" ").trim();
}

function splitIntoSentences(text: string) {
  return (text.match(/[^.?!।]+[.?!।]?/g) ?? [])
    .map((part) => normalizeWhitespace(part))
    .filter(Boolean);
}

function normalizeWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeForLookup(text: string) {
  return normalizeWhitespace(text).toLowerCase().replace(/[.?!।]+$/g, "");
}

function stripTerminalPunctuation(text: string) {
  return text.replace(/[.?!।]+$/g, "");
}

function replaceCaseInsensitive(text: string, searchValue: string, replacement: string) {
  const escaped = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(escaped, "gi"), replacement);
}

function containsCaseInsensitive(text: string, searchValue: string) {
  return text.toLowerCase().includes(searchValue.toLowerCase());
}

function getPhraseTranslationRules(
  sourceLanguage: SupportedLanguageCode,
  targetLanguage: SupportedLanguageCode,
) {
  return [
    ...(EXTRA_GENERAL_PHRASE_TRANSLATIONS[sourceLanguage]?.[targetLanguage] ?? []),
    ...(GENERAL_PHRASE_TRANSLATIONS[sourceLanguage]?.[targetLanguage] ?? []),
    ...(PHRASE_TRANSLATIONS[sourceLanguage]?.[targetLanguage] ?? []),
  ];
}

function getWordDictionary(
  sourceLanguage: SupportedLanguageCode,
  targetLanguage: SupportedLanguageCode,
) {
  return {
    ...(WORD_TRANSLATIONS[sourceLanguage]?.[targetLanguage] ?? {}),
    ...(EXTRA_WORD_TRANSLATIONS[sourceLanguage]?.[targetLanguage] ?? {}),
  };
}

function getLectureVerbPhrase(action: string, targetLanguage: SupportedLanguageCode) {
  const verbMap: Record<SupportedLanguageCode, Record<string, string>> = {
    en: {
      cover: "will cover",
      discuss: "will discuss",
      explore: "will explore",
      "look at": "will look at",
      see: "will see",
      study: "will study",
      understand: "will understand",
    },
    ta: {
      cover: "பார்க்கப் போகிறோம்",
      discuss: "விவாதிக்கப் போகிறோம்",
      explore: "ஆராயப் போகிறோம்",
      "look at": "பார்க்கப் போகிறோம்",
      see: "பார்க்கப் போகிறோம்",
      study: "படிக்கப் போகிறோம்",
      understand: "புரிந்துகொள்ளப் போகிறோம்",
    },
    hi: {
      cover: "देखेंगे",
      discuss: "चर्चा करेंगे",
      explore: "समझेंगे",
      "look at": "देखेंगे",
      see: "देखेंगे",
      study: "पढ़ेंगे",
      understand: "समझेंगे",
    },
  };

  return verbMap[targetLanguage][action] ?? verbMap[targetLanguage].see;
}

function applyTranslationCleanups(text: string, targetLanguage: SupportedLanguageCode) {
  let cleaned = text;

  for (const [from, to] of TRANSLATION_CLEANUPS[targetLanguage]) {
    cleaned = replaceCaseInsensitive(cleaned, from, to);
  }

  return cleaned;
}

function getStopwords(language: SupportedLanguageCode) {
  if (language === "ta") {
    return TAMIL_STOPWORDS;
  }

  if (language === "hi") {
    return HINDI_STOPWORDS;
  }

  return ENGLISH_STOPWORDS;
}

function extractTerminalPunctuationSafe(text: string) {
  const punctuation = text.match(/[.?!\u0964]+$/)?.[0];
  return punctuation ?? ".";
}

function cleanupTranslationSpacingSafe(text: string) {
  return normalizeWhitespace(text)
    .replace(/\s+([,.;!?\u0964])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .replace(/\s+([)\]}])/g, "$1");
}

function countWords(text: string) {
  return text.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
}

function countMatches(text: string, pattern: RegExp) {
  return text.match(pattern)?.length ?? 0;
}

function extractTerminalPunctuation(text: string) {
  const punctuation = text.match(/[.?!à¥¤]+$/)?.[0];
  return punctuation ?? ".";
}

function cleanupTranslationSpacing(text: string) {
  return normalizeWhitespace(text)
    .replace(/\s+([,.;!?à¥¤])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .replace(/\s+([)\]}])/g, "$1");
}
