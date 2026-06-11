import Link from "next/link";

const styles = {
    header: "relative h-[600px] overflow-hidden",
    backgroundImage: "absolute inset-0 object-cover w-full h-auto",
    overlay: "relative z-10 flex flex-col items-center justify-center text-center text-white bg-black/50 h-full px-4",
    heading: "text-4xl font-bold md:text-5xl lg:text-6xl",
    subheading: "mt-4 text-lg md:text-xl lg:text-2xl",
    button: "mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition-colors"
}

export default function HeroSection({data}: {readonly data:{ 
    heading: string, subHeading: string, link: {href: string, label: string}, 
    image: {url: string, alternativeText: string}
}}) {
    if(!data) return null;
    const {heading, subHeading, link} = data
    console.dir(data, {depth: null})
    return (
        <header className={styles.header}>
            <img 
                alt="Background"
                className={styles.backgroundImage}
                height={1080}
                src={"https://images.pexels.com/photos/7552374/pexels-photo-7552374.jpeg"}
                style={{
                    objectFit: "cover",
                    aspectRatio: "1920/1080",
                }} 
                width={1920}
            /> 
            <div className={styles.overlay}>
                <h1 className={styles.heading}>{heading}</h1>
                <p className={styles.subheading}>{subHeading}</p>
                <Link href={link.href} className={styles.button}> 
                    {link.label}
                </Link>
            </div>
        </header>
    )
}