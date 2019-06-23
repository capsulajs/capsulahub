Feature: Table extension

Scenario: Table columns and data is rendered according to configuration
   Given Table extension config columns with following <Header> and <accessor>
	   |<Header>|<accessor>|
	   |Column A|     a    |
	   |Column B|     b    |
	   |Column C|     c    |
    And The table config data is defined as follows
	   |accessor| values row1 | values row2 |
	   |    a   | A1          | A2          |
	   |    b   | B1          | B2          |
	   |    c   | C1          | C2          |
   When the application is run
   Then the table is rendered on the page and has the following structure and content
	   | Column A | Column B | Column C |
	   |     A1   |    B1    |    C1    |
	   |     A2   |    B2    |    C2    |


Scenario: Filtering is not taking into account case sesitivity
   Given I have the following table displayed on the page
	   | Column A | Column B | Column C |
	   |   test   |    B1    |    C1    |
	   |   ATEST  |    B2    |    C2    |
	   |   A3     |    B3    |    C3    |
   And filtering functionality is enabled
   When I type the <value> in the input field of Column A
	   |<value>|
	   |  T    |
	   |  t    |
   Then As result I see the following table
	   | Column A | Column B | Column C |
	   |   test   |    B1    |    C1    |
	   |   ATEST  |    B3    |    C3    |

Scenario: Count of rows per page is according to defaultPageSize  
   Given 25 rows are configured in table extension config
   And  defaultPageSize is set to 10
   When I run the application
   Then the first 10 rows are displayed in the table 
