export const Badge = ({ badge }: { badge: string })=> {
    return (
        <p className="text-regular-bold md:text-medium-bold text-accent-deep p-2 md:px-6 md:py-2.75 bg-accent/20 rounded-full flex items-center justify-center w-fit mx-auto">
            {badge}
        </p>)
}
