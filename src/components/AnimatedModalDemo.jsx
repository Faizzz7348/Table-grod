// THIS FILE IS UNUSED AND CAN BE DELETED
// Demo component not used in main application
// Only referenced in documentation for examples
// Safe to delete

                  alt="bali images"
                  width="500"
                  height="500"
                  className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                />
              </motion.div>
              <motion.div
                style={{
                  rotate: Math.random() * 20 - 10,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                whileTap={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
              >
                <img
                  src={images[1]}
                  alt="bali images"
                  width="500"
                  height="500"
                  className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                />
              </motion.div>
              <motion.div
                style={{
                  rotate: Math.random() * 20 - 10,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                whileTap={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
              >
                <img
                  src={images[2]}
                  alt="bali images"
                  width="500"
                  height="500"
                  className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                />
              </motion.div>
              <motion.div
                style={{
                  rotate: Math.random() * 20 - 10,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                whileTap={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
              >
                <img
                  src={images[3]}
                  alt="bali images"
                  width="500"
                  height="500"
                  className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                />
              </motion.div>
            </div>
            <div className="py-10 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 text-neutral-700 dark:text-neutral-300 mr-1"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  5 suka
                </span>
              </div>
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-neutral-700 dark:text-neutral-300 mr-1"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                </svg>
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  4.5 bintang
                </span>
              </div>
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-neutral-700 dark:text-neutral-300 mr-1"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 11l3 3l8 -8" />
                  <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
                </svg>
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  12 tempahan
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-neutral-800 px-4 py-8">
              <h2 className="text-neutral-600 dark:text-neutral-400 text-xs font-medium mb-4">
                DESTINASI ANDA
              </h2>
              <h3 className="text-neutral-800 dark:text-neutral-100 text-2xl font-bold mb-2">
                Percutian Menarik di Bali, Indonesia
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed mb-4">
                Alami keindahan pulau Bali dengan pantai yang memukau, budaya yang kaya, 
                dan masakan yang lazat. Pakej percutian lengkap termasuk penginapan, 
                pengangkutan, dan lawatan berpandu ke tempat-tempat menarik.
              </p>
              <div className="mt-6">
                <h4 className="text-neutral-700 dark:text-neutral-300 font-semibold mb-2">
                  Termasuk:
                </h4>
                <ul className="text-neutral-600 dark:text-neutral-400 text-sm space-y-1 list-disc list-inside">
                  <li>Penginapan hotel 5 bintang selama 4 malam</li>
                  <li>Sarapan pagi dan makan malam</li>
                  <li>Lawatan ke Ubud dan Tanah Lot</li>
                  <li>Pengangkutan dari dan ke lapangan terbang</li>
                  <li>Pemandu pelancongan berpengalaman</li>
                </ul>
              </div>
            </div>
          </ModalContent>
          <ModalFooter className="gap-4">
            <button className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28">
              Batal
            </button>
            <button className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-2 py-1 rounded-md border border-black text-sm w-28">
              Tempah Sekarang
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}
