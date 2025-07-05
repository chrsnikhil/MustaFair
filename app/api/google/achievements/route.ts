import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

interface GoogleAchievements {
  accountAge: number; // in days
  emailUsage: {
    totalEmails: number;
    emailsPerDay: number;
  };
  driveUsage: {
    totalFiles: number;
    storageUsed: number; // in MB
  };
  calendarEvents: number;
  achievements: {
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    badges: string[];
    score: number;
  };
}

// Mock Google data since we don't have full OAuth scopes
function generateMockGoogleAchievements(email: string, accountCreated?: string): GoogleAchievements {
  // Generate deterministic "achievements" based on email
  const emailHash = email.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const seed = Math.abs(emailHash);
  
  // Mock account age (between 1-10 years)
  const accountAge = accountCreated ? 
    Math.floor((Date.now() - new Date(accountCreated).getTime()) / (1000 * 60 * 60 * 24)) :
    300 + (seed % 3000); // 1-8 years
  
  // Generate realistic-looking metrics
  const totalEmails = 1000 + (seed % 50000); // 1k-51k emails
  const emailsPerDay = Math.floor(totalEmails / Math.max(accountAge, 1));
  const totalFiles = 50 + (seed % 2000); // 50-2050 files
  const storageUsed = 500 + (seed % 14500); // 0.5-15 GB
  const calendarEvents = 100 + (seed % 5000); // 100-5100 events
  
  const score = calculateGoogleScore({
    accountAge,
    totalEmails,
    totalFiles,
    storageUsed,
    calendarEvents
  });

  const tier = calculateTier(score);
  const badges = calculateGoogleBadges({
    accountAge,
    totalEmails,
    emailsPerDay,
    totalFiles,
    storageUsed,
    calendarEvents
  });

  return {
    accountAge,
    emailUsage: {
      totalEmails,
      emailsPerDay
    },
    driveUsage: {
      totalFiles,
      storageUsed
    },
    calendarEvents,
    achievements: {
      tier,
      badges,
      score
    }
  };
}

function calculateGoogleScore(data: {
  accountAge: number;
  totalEmails: number;
  totalFiles: number;
  storageUsed: number;
  calendarEvents: number;
}): number {
  const {
    accountAge,
    totalEmails,
    totalFiles,
    storageUsed,
    calendarEvents
  } = data;

  // Weighted scoring system for Google services usage
  const ageScore = Math.min(accountAge / 10, 300); // Max 300 points from account age
  const emailScore = Math.min(totalEmails / 100, 800); // Max 800 points from emails
  const fileScore = Math.min(totalFiles / 10, 400); // Max 400 points from files
  const storageScore = Math.min(storageUsed / 50, 300); // Max 300 points from storage
  const calendarScore = Math.min(calendarEvents / 20, 200); // Max 200 points from calendar

  return Math.floor(ageScore + emailScore + fileScore + storageScore + calendarScore);
}

function calculateTier(score: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' {
  if (score >= 1600) return 'Platinum';
  if (score >= 1000) return 'Gold';
  if (score >= 600) return 'Silver';
  return 'Bronze';
}

function calculateGoogleBadges(data: {
  accountAge: number;
  totalEmails: number;
  emailsPerDay: number;
  totalFiles: number;
  storageUsed: number;
  calendarEvents: number;
}): string[] {
  const badges = [];

  // Account age badges
  if (data.accountAge >= 3650) badges.push('Google Veteran (10+ years)');
  else if (data.accountAge >= 1825) badges.push('Google Senior (5+ years)');
  else if (data.accountAge >= 1095) badges.push('Google Regular (3+ years)');

  // Email usage badges
  if (data.totalEmails >= 50000) badges.push('Email Master');
  else if (data.totalEmails >= 20000) badges.push('Heavy Email User');
  else if (data.totalEmails >= 5000) badges.push('Active Communicator');

  if (data.emailsPerDay >= 50) badges.push('Daily Communicator');

  // Drive usage badges
  if (data.storageUsed >= 10000) badges.push('Storage Expert (10+ GB)');
  else if (data.storageUsed >= 5000) badges.push('Drive Power User (5+ GB)');

  if (data.totalFiles >= 1000) badges.push('File Organizer');

  // Calendar badges
  if (data.calendarEvents >= 2000) badges.push('Schedule Master');
  else if (data.calendarEvents >= 1000) badges.push('Calendar Pro');

  // Productivity badges
  if (data.totalFiles >= 500 && data.calendarEvents >= 500) {
    badges.push('Productivity Champion');
  }

  return badges;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // For now, generate mock data based on email
    // In production, you would use Google APIs with proper OAuth scopes
    const achievements = generateMockGoogleAchievements(email);
    
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Google API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Google data' },
      { status: 500 }
    );
  }
}
