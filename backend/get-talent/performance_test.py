from profileScraper.cv_parser.pdf_scraper import PdfScraper

file = "resumes/CV_Gaith_Weslati_Full_Stack.pdf"
data = PdfScraper(file).run()
print(data)