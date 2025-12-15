'use client';

export default function TestPage() {
    return (
        <div className='min-h-screen bg-gray-100 p-8'>
            <div className='max-w-4xl mx-auto space-y-4'>
                <h1 className='text-4xl font-bold text-blue-600'>
                    Tailwind CSS Test
                </h1>

                <div className='bg-white p-6 rounded-lg shadow-lg'>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                        Card with Shadow
                    </h2>
                    <p className='text-gray-600'>
                        If you see shadows, rounded corners, and colors,
                        Tailwind is working!
                    </p>
                </div>

                <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white'>
                    <h2 className='text-2xl font-bold'>Gradient Background</h2>
                    <p>This should have a blue to purple gradient</p>
                </div>

                <button className='bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all'>
                    Hover Me - Button Test
                </button>

                <div className='grid grid-cols-3 gap-4'>
                    <div className='bg-red-500 p-4 rounded text-white text-center'>
                        Red
                    </div>
                    <div className='bg-yellow-500 p-4 rounded text-white text-center'>
                        Yellow
                    </div>
                    <div className='bg-green-500 p-4 rounded text-white text-center'>
                        Green
                    </div>
                </div>
            </div>
        </div>
    );
}
