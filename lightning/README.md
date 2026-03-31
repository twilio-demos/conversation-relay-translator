# ConversationRelay Translator Web App

A Next.js TypeScript web application for managing ConversationRelay translation profiles and settings.

## Features

- **Profile Management**: Create and manage user profiles with language, voice, and phone number settings
- **Caller Settings**: Configure source language, voice, transcription, and TTS providers
- **Callee Settings**: Set up destination language and voice preferences
- **AWS Integration**: Direct integration with DynamoDB for profile storage
- **Dark Mode**: Automatic dark mode support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: AWS DynamoDB
- **AWS SDK**: @aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- AWS account with DynamoDB table deployed (from parent CloudFormation stack)

### Installation

1. Install dependencies:

```bash
cd webapp
npm install
```

2. Configure environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your AWS credentials and DynamoDB table name:

```env
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=CR-TRANSLATOR-AppDatabase
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
webapp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   └── profiles/      # Profile CRUD endpoints
│   │   ├── profiles/          # Profile management pages
│   │   ├── sessions/          # Call session pages
│   │   ├── settings/          # Settings pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── Navigation.tsx     # Navigation bar
│   │   └── ProfileForm.tsx    # Profile creation/edit form
│   ├── lib/                   # Utilities
│   │   └── dynamodb.ts        # DynamoDB operations
│   └── types/                 # TypeScript types
│       └── profile.ts         # Profile type definitions
├── public/                    # Static assets
├── .env.local.example         # Environment variables template
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## API Routes

### Profiles

- `GET /api/profiles` - List all profiles
- `POST /api/profiles` - Create a new profile
- `GET /api/profiles/[phoneNumber]` - Get a specific profile
- `PUT /api/profiles/[phoneNumber]` - Update a profile
- `DELETE /api/profiles/[phoneNumber]` - Delete a profile

## User Profile Structure

```typescript
interface UserProfile {
  phoneNumber: string;           // Caller's phone number
  name: string;                  // User's name

  // Caller Settings
  sourceLanguage: string;        // e.g., "en-US"
  sourceLanguageCode: string;    // e.g., "en"
  sourceLanguageFriendly: string;// e.g., "English - United States"
  sourceTranscriptionProvider: "Deepgram" | "Google";
  sourceTtsProvider: "Amazon" | "Google";
  sourceVoice: string;           // e.g., "Matthew-Generative"

  // Callee Settings
  calleeDetails: boolean;        // Use custom callee settings
  calleeNumber: string;          // Callee's phone number
  calleeLanguage: string;        // e.g., "es-MX"
  calleeLanguageCode: string;    // e.g., "es-MX"
  calleeLanguageFriendly: string;// e.g., "Spanish - Mexico"
  calleeTranscriptionProvider: "Deepgram" | "Google";
  calleeTtsProvider: "Amazon" | "Google";
  calleeVoice: string;           // e.g., "Lupe-Generative"
}
```

## Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Deploy to AWS (Amplify, ECS, etc.)

Ensure your deployment environment has:
- IAM role with DynamoDB access (preferred over access keys)
- Environment variables configured
- Node.js 18+ runtime

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AWS_REGION` | AWS region for DynamoDB | Yes |
| `DYNAMODB_TABLE_NAME` | Name of DynamoDB table | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key (local dev only) | Local only |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key (local dev only) | Local only |

**Note**: In production, use IAM roles instead of access keys.

## Supported Languages

- English (US)
- Spanish (Mexico, Spain)
- French (France)
- German (Germany)
- Italian (Italy)
- Portuguese (Brazil)
- Japanese (Japan)
- Chinese (Mandarin)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT
