
const BASE_URL = 'http://localhost:3001';

const test = async () => {
    console.log('Testing Derdine Forum API...\n');

    try {
        // 1. Test root endpoint
        console.log('1. Testing root endpoint...');
        const rootRes = await fetch(BASE_URL);
        const rootText = await rootRes.text();
        console.log('Root response:', rootText.substring(0, 200));

        // 2. Seed data
        console.log('\n2. Seeding data...');
        const seedRes = await fetch(`${BASE_URL}/api/seed`, { method: 'POST' });
        const seedText = await seedRes.text();
        console.log('Seed response:', seedText.substring(0, 500));

        // 3. Get theme
        console.log('\n3. Getting theme...');
        const themeRes = await fetch(`${BASE_URL}/api/theme`);
        const themeText = await themeRes.text();
        console.log('Theme response:', themeText.substring(0, 300));

        // 4. Get categories
        console.log('\n4. Getting categories...');
        const catRes = await fetch(`${BASE_URL}/api/categories`);
        const catText = await catRes.text();
        console.log('Categories response:', catText.substring(0, 300));

        // 5. Get labels
        console.log('\n5. Getting labels...');
        const labelsRes = await fetch(`${BASE_URL}/api/labels`);
        const labelsText = await labelsRes.text();
        console.log('Labels response:', labelsText.substring(0, 300));

        console.log('\n✅ Test completed!');
    } catch (error) {
        console.error('Error:', error);
    }
};

test();
