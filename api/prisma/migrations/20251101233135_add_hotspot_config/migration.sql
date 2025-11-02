-- CreateTable
CREATE TABLE `hotspot_config` (
    `id` VARCHAR(191) NOT NULL,
    `businessName` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `merchantCode` VARCHAR(191) NOT NULL,
    `packages` TEXT NOT NULL,
    `paymentInstructions` TEXT NOT NULL,
    `theme` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
