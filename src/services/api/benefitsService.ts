import axios from 'axios';

export interface BenefitsSummary {
  id: string;
  patientName: string;
  insuranceProvider: string;
  memberId: string;
  callDate: string;
  benefits: {
    copay: { primary: string; specialist: string };
    deductible: { individual: string; family: string };
    coinsurance: string;
    outOfPocket: { individual: string; family: string };
  };
}

export interface BenefitsDetail {
  id: string;
  patientName: string;
  patientDOB: string;
  insuranceProvider: string;
  insurancePhone: string;
  memberId: string;
  groupNumber: string;
  callDate: string;
  callDuration: string;
  benefits: {
    copay: { 
      primary: string; 
      specialist: string; 
      urgentCare: string; 
      emergency: string;
    };
    deductible: { 
      individual: string; 
      family: string;
      status: string;
      network: string;
    };
    coinsurance: {
      percentage: string;
      afterDeductible: boolean;
      preventiveCare: string;
    };
    outOfPocket: { 
      individual: string; 
      family: string;
      status: string;
    };
    additionalInfo: {
      preAuth: string;
      referrals: string;
      planYear: string;
    };
  };
}

export const benefitsService = {
  // Get a list of all benefits summaries
  getBenefitsList: async (): Promise<BenefitsSummary[]> => {
    try {
      // In a real implementation, this would call your backend API
      // This is a mock implementation for demonstration purposes
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response data
      return [
        {
          id: '1',
          patientName: 'John Smith',
          insuranceProvider: 'Blue Cross',
          memberId: 'BC123456789',
          callDate: '2025-04-12',
          benefits: {
            copay: { primary: '$20', specialist: '$35' },
            deductible: { individual: '$1,500', family: '$3,000' },
            coinsurance: '20%',
            outOfPocket: { individual: '$5,000', family: '$10,000' }
          }
        },
        {
          id: '2',
          patientName: 'Sarah Johnson',
          insuranceProvider: 'Aetna',
          memberId: 'AET987654321',
          callDate: '2025-04-10',
          benefits: {
            copay: { primary: '$25', specialist: '$45' },
            deductible: { individual: '$2,000', family: '$4,000' },
            coinsurance: '15%',
            outOfPocket: { individual: '$6,000', family: '$12,000' }
          }
        }
      ];
    } catch (error) {
      console.error('Error getting benefits list:', error);
      throw new Error('Failed to retrieve benefits information.');
    }
  },
  
  // Get detailed benefits information for a specific ID
  getBenefitsDetail: async (id: string): Promise<BenefitsDetail> => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock detailed benefits data for ID 1
      if (id === '1') {
        return {
          id: '1',
          patientName: 'John Smith',
          patientDOB: '1980-05-15',
          insuranceProvider: 'Blue Cross Blue Shield',
          insurancePhone: '+1 (800) 123-4567',
          memberId: 'BC123456789',
          groupNumber: 'GRP7890',
          callDate: '2025-04-12T14:30:00',
          callDuration: '4:32',
          benefits: {
            copay: { 
              primary: '$20', 
              specialist: '$35', 
              urgentCare: '$50', 
              emergency: '$250'
            },
            deductible: { 
              individual: '$1,500', 
              family: '$3,000',
              status: '$500 met',
              network: 'In-Network'
            },
            coinsurance: {
              percentage: '20%',
              afterDeductible: true,
              preventiveCare: '0%'
            },
            outOfPocket: { 
              individual: '$5,000', 
              family: '$10,000',
              status: '$1,200 met'
            },
            additionalInfo: {
              preAuth: 'Required for inpatient services, imaging, and certain procedures',
              referrals: 'Not required for specialists',
              planYear: 'January 1 - December 31'
            }
          }
        };
      }
      
      // Mock detailed benefits data for ID 2
      if (id === '2') {
        return {
          id: '2',
          patientName: 'Sarah Johnson',
          patientDOB: '1975-08-22',
          insuranceProvider: 'Aetna',
          insurancePhone: '+1 (888) 234-5678',
          memberId: 'AET987654321',
          groupNumber: 'ATN5678',
          callDate: '2025-04-10T11:15:00',
          callDuration: '3:45',
          benefits: {
            copay: { 
              primary: '$25', 
              specialist: '$45', 
              urgentCare: '$60', 
              emergency: '$300'
            },
            deductible: { 
              individual: '$2,000', 
              family: '$4,000',
              status: '$750 met',
              network: 'In-Network'
            },
            coinsurance: {
              percentage: '15%',
              afterDeductible: true,
              preventiveCare: '0%'
            },
            outOfPocket: { 
              individual: '$6,000', 
              family: '$12,000',
              status: '$1,500 met'
            },
            additionalInfo: {
              preAuth: 'Required for all hospital admissions and outpatient surgeries',
              referrals: 'Required for specialists',
              planYear: 'July 1 - June 30'
            }
          }
        };
      }
      
      // Default response if ID not found
      throw new Error('Benefits not found');
    } catch (error) {
      console.error(`Error getting benefits detail for ID ${id}:`, error);
      throw new Error('Failed to retrieve detailed benefits information.');
    }
  },
  
  // Save or update benefits information
  saveBenefits: async (benefits: Partial<BenefitsDetail>): Promise<string> => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      return benefits.id || 'new-id-12345';
    } catch (error) {
      console.error('Error saving benefits:', error);
      throw new Error('Failed to save benefits information.');
    }
  }
};