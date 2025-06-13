export async function uploadImage(imageBase64: string): Promise<string | null> {
    const formData = new FormData();
    formData.append('image', imageBase64); 
    formData.append("type", "base64");
    console.log("Uploading")

    try {
        // Sending the image to Imgur
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`, 
            },
            body: formData,
        });

        // Debug: Check if the response is okay
        if (!response.ok) {
            console.error(`Imgur upload failed with status: ${response.status}`);
            return null;
        }

        // Parsing the JSON response from Imgur
        const data = await response.json();
        
        // Check if upload was successful and return the image URL
        if (data.success) {
            const imageUrl = data.data.link;
            console.log(`Image uploaded successfully: ${imageUrl}`);
            return imageUrl;  // Return the image URL
        } else {
            console.error('Error uploading image:', data);
            return null;
        }
    } catch (error: unknown) {
        // Catch any errors during the fetch or processing stages
        if (error instanceof Error) {
            console.error('Error uploading image to Imgur:', error.message);
        } else {
            console.error('An unknown error occurred while uploading image:', error);
        }
        return null;
    }
}
