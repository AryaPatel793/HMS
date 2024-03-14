export class Constant {
  public static BASE_URL = 'http://localhost:8080/'; 

  public static states: string[] = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

    public static cityData: { [key: string]: string[] } = {
        'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
        'Arunachal Pradesh': ['Itanagar', 'Tawang', 'Ziro', 'Pasighat'],
        'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'],
        'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia'],
        'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg'],
        'Goa': ['Panaji', 'Margao', 'Vasco Da Gama', 'Mapusa', 'Ponda'],
        'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
        'Haryana': ['Faridabad', 'Gurgaon', 'Rohtak', 'Hisar', 'Panipat'],
        'Himachal Pradesh': ['Shimla', 'Solan', 'Dharamshala', 'Baddi', 'Una'],
        'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
        'Karnataka': ['Bengaluru', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
        'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Kollam', 'Thrissur'],
        'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'],
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
        'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Ukhrul', 'Churachandpur'],
        'Meghalaya': ['Shillong', 'Cherrapunji', 'Tura', 'Jowai', 'Nongstoin'],
        'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Lawngtlai', 'Serchhip'],
        'Nagaland': ['Kohima', 'Dimapur', 'Wokha', 'Tuensang', 'Mokokchung'],
        'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur'],
        'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
        'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer', 'Bikaner'],
        'Sikkim': ['Gangtok', 'Pelling', 'Lachung', 'Ravangla', 'Namchi'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
        'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar'],
        'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar', 'Belonia'],
        'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut'],
        'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur'],
        'West Bengal': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman']
      };

      public static timeSlot : string[] = ['10 to 11 am', '11 to 12 pm', '12 to 1 pm', '1 to 2 pm', '2 to 3 pm', '3 to 4 pm', '4 to 5 pm', '5 to 6 pm','6 to 7 pm'];
 }