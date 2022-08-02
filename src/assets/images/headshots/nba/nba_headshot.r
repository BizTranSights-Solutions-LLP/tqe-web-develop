
### scrape NBA player headshots from ESPN
library(rvest)

# Store web url
html.page <- read_html("http://www.espn.com/nba/players")

urls <- html.page %>% # urls: get team href
  html_nodes(".small-logos div a") %>%
  html_attr("href")

for(i in 1:length(urls)){
  
urls1 <- paste0("http://www.espn.com",urls[i])
html.page1 <- read_html(urls1)
urls1 <- html.page1 %>% # inner link1 (urls1): get player href
  html_nodes(".Table2__td a") %>% 
  # html_text()
  html_attr("href")

for(j in 1:length(urls1)){
  
html.page2 <- read_html(urls1[j])
urls2 <- html.page2 %>% # inner link2 (urls2): get player image
  html_nodes("img") %>%
  html_attr("src")

name <- html.page2 %>% # inner link2 (urls2): get player name text
  html_nodes("h1") %>%
  html_text()
name <- name[1] # first element of text is player name

download.file(urls2[1], destfile = paste(name,".jpg",sep = "")) # first element of image href is player headshot

}# end inner for loop j

}# end outter for loop i

###### missing individual headshots ##########


# Store web url
html.page2 <- read_html("http://www.espn.com/nba/player/_/id/2960236/maximilian-kleber")
# html.page2 <- read_html(urls1[j])
urls2 <- html.page2 %>% # inner link2 (urls2): get player image
  html_nodes("img") %>%
  html_attr("src")

name <- html.page2 %>% # inner link2 (urls2): get player name text
  html_nodes("h1") %>%
  html_text()
name <- name[1] # first element of text is player name

download.file(urls2[1], destfile = paste("/Users/zj/R/TQE/NBA/PlayervsTeam/app/www/headshot_ind/",name,".jpg",sep = "")) # first element of image href is player headshot


