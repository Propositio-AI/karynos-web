import { motion } from "framer-motion";
import Image from "next/image";

type JobImageSectionProps = {
	imageFullscreen: boolean;
	expanded: boolean;
	onDragEnd: (event: any, info: any) => void;
	imageUrl?: string;
};

export const JobImageSection = ({
	imageFullscreen,
	expanded,
	onDragEnd,
	imageUrl = "/sample.png",
}: JobImageSectionProps) => {
	return (
		<motion.div
			className="absolute z-10 w-full"
			drag="y"
			dragConstraints={{ top: 0, bottom: 0 }}
			onDragEnd={onDragEnd}
			initial="collapsed"
			animate={imageFullscreen ? "fullscreen" : expanded ? "expanded" : "collapsed"}
			variants={{
				collapsed: { height: "45%" },
				expanded: { height: "18%" },
				fullscreen: { height: "100%" },
			}}
			transition={{
				type: "spring",
				stiffness: 120,
				damping: 15,
			}}
		>
			<div className="relative h-full w-full bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_100%)]">
				<Image
					src={imageUrl}
					alt="Job Matching"
					fill
					priority
					className="pointer-events-none object-contain object-center"
					sizes="(max-width: 768px) 100vw, 720px"
				/>
			</div>
		</motion.div>
	);
};
